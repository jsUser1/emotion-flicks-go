import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import type { FilterCriteria } from "@/lib/search";

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Documentary",
  "Drama",
  "Horror",
  "Mystery",
  "Romance",
  "Sport",
  "Thriller",
  "Fantasy",
];

const LANGUAGES = ["Any", "English", "Spanish", "French", "German", "Hindi", "Japanese", "Korean"];

const PLATFORMS = ["Any", "NETFLIX", "PRIME", "HULU", "DISNEY", "HBO", "MAX"];

type Props = {
  value: FilterCriteria;
  onChange: (next: FilterCriteria) => void;
};

export default function AdvancedFilters({ value, onChange }: Props) {
  const runtime = useMemo(() => [value.runtimeMax ?? 180], [value.runtimeMax]);
  const rating = useMemo(() => [value.ratingMin ?? 0], [value.ratingMin]);

  return (
    <section className="container mx-auto px-4 mt-4" aria-label="Advanced filters">
      <div className="rounded-lg border bg-card/60 backdrop-blur p-4">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className="text-sm text-muted-foreground">Genre</label>
            <Select
              value={value.genres?.[0] ?? "any"}
              onValueChange={(v) => onChange({ ...value, genres: v === "any" ? undefined : [v] })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Language</label>
            <Select
              value={value.language ?? "Any"}
              onValueChange={(v) => onChange({ ...value, language: v === "Any" ? undefined : v })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Platform</label>
            <Select
              value={value.platforms?.[0] ?? "Any"}
              onValueChange={(v) => onChange({ ...value, platforms: v === "Any" ? undefined : [v] })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Year from</label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 2015"
              value={value.yearMin ?? ""}
              onChange={(e) => onChange({ ...value, yearMin: e.target.value ? Number(e.target.value) : undefined })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Year to</label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 2024"
              value={value.yearMax ?? ""}
              onChange={(e) => onChange({ ...value, yearMax: e.target.value ? Number(e.target.value) : undefined })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Max runtime (min)</label>
            <div className="mt-2">
              <Slider
                value={runtime}
                onValueChange={([v]) => onChange({ ...value, runtimeMax: v })}
                min={60}
                max={200}
                step={10}
              />
              <div className="mt-1 text-xs text-muted-foreground">Up to <Badge variant="secondary">{runtime[0]} min</Badge></div>
            </div>
          </div>

          <div className="md:col-span-3 lg:col-span-6">
            <label className="text-sm text-muted-foreground">Minimum rating</label>
            <div className="mt-2">
              <Slider
                value={rating}
                onValueChange={([v]) => onChange({ ...value, ratingMin: v })}
                min={0}
                max={10}
                step={0.1}
              />
              <div className="mt-1 text-xs text-muted-foreground">At least <Badge variant="secondary">{rating[0].toFixed(1)}</Badge>/10</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
