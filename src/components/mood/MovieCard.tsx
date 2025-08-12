import { Movie } from "@/data/movies";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";


type Props = {
  movie: Movie;
  onWatch?: (movie: Movie) => void;
};

export default function MovieCard({ movie, onWatch }: Props) {
  return (
    <article className="group">
      <Card className="overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster}
            alt={`${movie.title} movie poster — mood-based recommendation`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {movie.moodTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-secondary/80">
                {tag}
              </Badge>
            ))}
          </div>
          {onWatch && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onWatch(movie);
              }}
              aria-label={`Mark ${movie.title} as watched`}
            >
              <Check className="mr-1 h-4 w-4" />
              Watched
            </Button>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-base font-semibold leading-tight">{movie.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {movie.year} • {movie.genres.join(", ")} • {movie.rating.toFixed(1)}/10
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground/90">
            {movie.synopsis}
          </p>
        </CardContent>
      </Card>
    </article>
  );
}
