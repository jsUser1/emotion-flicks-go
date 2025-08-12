import { useCallback, useEffect, useState } from "react";
import type { Movie } from "@/data/movies";

export type ViewingHistory = {
  viewsById: Record<string, number>;
  genreWeights: Record<string, number>;
  moodWeights: Record<string, number>;
  lastViewedAt: Record<string, number>;
  totalViews: number;
};

const STORAGE_KEY = "moodflix.history.v1";

const loadHistory = (): ViewingHistory => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ViewingHistory;
  } catch {
    // ignore
  }
  return {
    viewsById: {},
    genreWeights: {},
    moodWeights: {},
    lastViewedAt: {},
    totalViews: 0,
  };
};

const saveHistory = (h: ViewingHistory) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
  } catch {
    // ignore
  }
};

export const useRecommender = () => {
  const [history, setHistory] = useState<ViewingHistory>(() => loadHistory());

  useEffect(() => {
    // Ensure we hydrate from storage on mount
    setHistory(loadHistory());
  }, []);

  const recordView = useCallback((movie: Movie) => {
    setHistory((prev) => {
      const next: ViewingHistory = {
        ...prev,
        viewsById: { ...prev.viewsById },
        genreWeights: { ...prev.genreWeights },
        moodWeights: { ...prev.moodWeights },
        lastViewedAt: { ...prev.lastViewedAt },
        totalViews: prev.totalViews + 1,
      };

      next.viewsById[movie.id] = (next.viewsById[movie.id] || 0) + 1;
      next.lastViewedAt[movie.id] = Date.now();

      movie.genres.forEach((g) => {
        next.genreWeights[g] = (next.genreWeights[g] || 0) + 1;
      });
      movie.moodTags.forEach((t) => {
        next.moodWeights[t] = (next.moodWeights[t] || 0) + 1;
      });

      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    const empty: ViewingHistory = {
      viewsById: {},
      genreWeights: {},
      moodWeights: {},
      lastViewedAt: {},
      totalViews: 0,
    };
    saveHistory(empty);
    setHistory(empty);
  }, []);

  const getRecommendations = useCallback(
    (allMovies: Movie[], excludeWatched = true, limit = 12): Movie[] => {
      if (!history.totalViews) return [];

      const now = Date.now();
      const HALF_LIFE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
      const idMap = new Map(allMovies.map((m) => [m.id, m] as const));

      // Build recency weights per mood/genre from viewed history
      const moodRecency: Record<string, number> = {};
      const genreRecency: Record<string, number> = {};
      Object.entries(history.lastViewedAt).forEach(([id, ts]) => {
        const m = idMap.get(id);
        if (!m) return;
        const dt = Math.max(0, now - ts);
        const recency = Math.exp(-dt / HALF_LIFE_MS); // 1.0 if just viewed, decays over time
        m.moodTags.forEach((t) => {
          moodRecency[t] = (moodRecency[t] || 0) + recency;
        });
        m.genres.forEach((g) => {
          genreRecency[g] = (genreRecency[g] || 0) + recency * 0.7;
        });
      });

      const scored = allMovies
        .filter((m) => !excludeWatched || !history.viewsById[m.id])
        .map((m) => {
          let score = 0;
          // Mood tags weighted higher
          m.moodTags.forEach((t) => {
            score += (history.moodWeights[t] || 0) * 1.2;
            score += (moodRecency[t] || 0) * 1.0; // recency boost for recently viewed similar moods
          });
          // Genres
          m.genres.forEach((g) => {
            score += (history.genreWeights[g] || 0) * 0.8;
            score += (genreRecency[g] || 0) * 0.6; // recency boost for similar genres
          });
          // Slight rating bias
          score += (m.rating || 0) * 0.1;

          return { movie: m, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => s.movie);

      return scored;
    },
    [history]
  );

  return { history, recordView, getRecommendations, clearHistory } as const;
};
