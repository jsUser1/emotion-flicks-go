// Utility functions for parsing natural language queries and applying multi-filter search
import type { Movie } from "@/data/movies";

export type FilterCriteria = {
  genres?: string[];
  yearMin?: number;
  yearMax?: number;
  language?: string;
  runtimeMax?: number; // minutes
  ratingMin?: number; // 0-10
  platforms?: string[];
};

const GENRE_KEYWORDS: Record<string, string> = {
  comedy: "Comedy",
  funny: "Comedy",
  humor: "Comedy",
  action: "Action",
  thriller: "Thriller",
  romance: "Romance",
  romantic: "Romance",
  drama: "Drama",
  documentary: "Documentary",
  horror: "Horror",
  mystery: "Mystery",
  adventure: "Adventure",
  sport: "Sport",
  fantasy: "Fantasy",
};

const MOOD_KEYWORDS = [
  "happy",
  "sad",
  "energetic",
  "calm",
  "romantic",
  "dark",
  "adventurous",
  "thoughtful",
];

const PLATFORM_KEYWORDS = ["netflix", "prime", "hulu", "disney", "hbo", "max"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function parseSearchQuery(query: string): FilterCriteria & { text: string } {
  const q = (query || "").toLowerCase();
  const criteria: FilterCriteria = {};

  // Genres from keywords
  const genres = new Set<string>();
  for (const key in GENRE_KEYWORDS) {
    if (q.includes(key)) genres.add(GENRE_KEYWORDS[key]);
  }
  if (genres.size) criteria.genres = Array.from(genres);

  // Moods as genre hints (keep separate in ranking; here only for text pass-through)
  const moods = MOOD_KEYWORDS.filter((m) => q.includes(m));

  // Runtime parsing (e.g., "90-min", "under 100", "short")
  const runtimeMatch = q.match(/(\d{2,3})\s*(min|minutes|m)\b/);
  if (runtimeMatch) {
    const mins = parseInt(runtimeMatch[1], 10);
    if (!Number.isNaN(mins)) criteria.runtimeMax = clamp(mins, 40, 240);
  } else if (/short|quick|snack|snappy/.test(q)) {
    criteria.runtimeMax = 100;
  }

  // Year filters
  const yearExact = q.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearExact) {
    criteria.yearMin = parseInt(yearExact[1], 10);
    criteria.yearMax = criteria.yearMin;
  }
  const afterMatch = q.match(/after\s+(19\d{2}|20\d{2})/);
  if (afterMatch) criteria.yearMin = parseInt(afterMatch[1], 10);
  const beforeMatch = q.match(/before\s+(19\d{2}|20\d{2})/);
  if (beforeMatch) criteria.yearMax = parseInt(beforeMatch[1], 10);
  const betweenMatch = q.match(/between\s+(19\d{2}|20\d{2})\s+and\s+(19\d{2}|20\d{2})/);
  if (betweenMatch) {
    criteria.yearMin = parseInt(betweenMatch[1], 10);
    criteria.yearMax = parseInt(betweenMatch[2], 10);
  }

  // Rating
  let ratingPlus: RegExpMatchArray | null = null;
  const ratingPatternPlus = q.match(/(imdb\s*)?(rating\s*)?(\d+(?:\.\d+)?)\s*\+/);
  const ratingOutOfTen = q.match(/\b(\d(?:\.\d)?)\/10\b/);
  ratingPlus = ratingPatternPlus || ratingOutOfTen;
  if (ratingPlus) {
    const num = parseFloat((ratingPatternPlus ? ratingPatternPlus[3] : ratingOutOfTen?.[1]) || "");
    if (!Number.isNaN(num)) criteria.ratingMin = clamp(num, 0, 10);
  } else if (q.includes("highly rated") || q.includes("top rated") || q.includes(">= 8")) {
    criteria.ratingMin = 8;
  }

  // Platforms
  const platforms = PLATFORM_KEYWORDS.filter((p) => q.includes(p));
  if (platforms.length) criteria.platforms = platforms.map((p) => p.toUpperCase());

  // Languages (very simple)
  const langMatch = q.match(/\b(english|spanish|french|german|hindi|japanese|korean)\b/);
  if (langMatch) criteria.language = langMatch[1][0].toUpperCase() + langMatch[1].slice(1);

  // Remaining text used for fuzzy matching on title and mood tags
  return { ...criteria, text: [q, ...moods].join(" ").trim() };
}

function matchesFilters(movie: Movie, f: FilterCriteria): boolean {
  if (f.genres?.length && !f.genres.some((g) => movie.genres.map((x) => x.toLowerCase()).includes(g.toLowerCase()))) return false;
  if (typeof f.yearMin === "number" && movie.year < f.yearMin) return false;
  if (typeof f.yearMax === "number" && movie.year > f.yearMax) return false;
  if (typeof f.ratingMin === "number" && (movie.rating ?? 0) < f.ratingMin) return false;
  if (f.language && (movie as any).language && ((movie as any).language as string).toLowerCase() !== f.language.toLowerCase()) return false;
  if (f.runtimeMax && (movie as any).runtime && ((movie as any).runtime as number) > f.runtimeMax) return false;
  if (f.platforms?.length && (movie as any).platforms) {
    const mp = ((movie as any).platforms as string[]).map((p) => p.toLowerCase());
    if (!f.platforms.some((p) => mp.includes(p.toLowerCase()))) return false;
  }
  return true;
}

export function filterMoviesByQuery(query: string, allMovies: Movie[], extraFilters?: FilterCriteria): Movie[] {
  const parsed = parseSearchQuery(query);
  const combined: FilterCriteria = { ...parsed, ...extraFilters };
  const text = parsed.text.trim();

  const list = allMovies
    .filter((m) => matchesFilters(m, combined))
    .map((m) => {
      // Simple scoring
      let score = 0;
      if (text) {
        const t = text.toLowerCase();
        if (m.title.toLowerCase().includes(t)) score += 5;
        if (m.genres.some((g) => t.includes(g.toLowerCase()) || g.toLowerCase().includes(t))) score += 3;
        if (m.moodTags.some((tag) => t.includes(tag))) score += 4;
      }
      // Prefer higher ratings and newer movies slightly
      score += (m.rating || 0) * 0.2 + (m.year - 2000) * 0.01;
      return { movie: m, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.movie);

  return list;
}
