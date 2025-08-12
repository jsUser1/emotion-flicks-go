import { useEffect, useMemo, useState } from "react";
import MoodSearch from "@/components/mood/MoodSearch";
import MovieCard from "@/components/mood/MovieCard";
import { movies } from "@/data/movies";
import type { Movie } from "@/data/movies";
import { useToast } from "@/hooks/use-toast";
import { useRecommender } from "@/hooks/use-recommender";
import AdvancedFilters from "@/components/mood/AdvancedFilters";
import { filterMoviesByQuery, type FilterCriteria } from "@/lib/search";
import happyPoster from "@/assets/posters/happy.jpg";
import darkPoster from "@/assets/posters/dark.jpg";
import energeticPoster from "@/assets/posters/energetic.jpg";
import romanticPoster from "@/assets/posters/romantic.jpg";
import adventurousPoster from "@/assets/posters/adventurous.jpg";
import calmPoster from "@/assets/posters/calm.jpg";

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(movies.slice(0, 12));
  const [filters, setFilters] = useState<FilterCriteria>({});
  const { toast } = useToast();

  const { history, recordView, getRecommendations } = useRecommender();
  const handleWatch = (m: Movie) => {
    recordView(m);
    toast({ title: "Added to history", description: `Marked "${m.title}" as watched.` });
  };
  const handleView = (m: Movie) => {
    recordView(m);
  };
  const recommended = useMemo(() => getRecommendations(movies, true, 8), [getRecommendations, movies, history]);

  const onSearch = (value: string) => {
    setQuery(value);
    const list = filterMoviesByQuery(value, movies, filters);
    setResults(list);
    if (value && list.length === 0) {
      toast({ title: "No matches", description: `No movies found for "${value}".` });
    }
  };

  const heading = useMemo(
    () => (query ? `Movies for: ${query}` : "Trending by Mood"),
    [query]
  );

  useEffect(() => {
    if (!query && Object.keys(filters).length === 0) {
      setResults(movies.slice(0, 12));
      return;
    }
    const list = filterMoviesByQuery(query, movies, filters);
    setResults(list);
  }, [query, filters]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <a href="/" className="font-semibold tracking-tight">
            MoodFlix
          </a>
          <nav className="text-sm text-muted-foreground">Mood-based movie recommendations</nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-20 opacity-80 saturate-150">
            <div className="grid h-full w-full grid-cols-3 gap-2 blur-sm md:blur">
              {[happyPoster, romanticPoster, energeticPoster, darkPoster, adventurousPoster, calmPoster].map((src, i) => (
                <img key={i} src={src} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="lazy" />
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_500px_at_50%_-10%,hsl(var(--primary)/0.25),transparent_70%),radial-gradient(800px_300px_at_20%_20%,hsl(var(--accent)/0.15),transparent_60%),radial-gradient(800px_300px_at_80%_30%,hsl(var(--secondary)/0.15),transparent_60%)]"/>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/10 via-background/40 to-background" />
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <h1 className="mx-auto max-w-3xl text-center text-4xl font-bold tracking-tight sm:text-5xl">
              Mood-based Movie Recommendations
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Tell us how you feel, and we’ll suggest the perfect film for your mood.
            </p>

            <div className="mt-8">
              <MoodSearch onSearch={onSearch} />
            </div>
          </div>
        </section>

        <AdvancedFilters value={filters} onChange={setFilters} />

        {recommended.length > 0 && query === "" && (
          <section className="container mx-auto px-4 pb-8">
            <h2 className="mb-4 text-xl font-semibold">Recommended for You</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {recommended.map((m) => (
                <MovieCard key={m.id} movie={m} onWatch={handleWatch} onView={handleView} />
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 pb-16">
          <h2 className="mb-4 text-xl font-semibold">{heading}</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((m) => (
              <MovieCard key={m.id} movie={m} onWatch={handleWatch} onView={handleView} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex h-14 items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MoodFlix</p>
          <a href="#" className="hover:underline">About</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
