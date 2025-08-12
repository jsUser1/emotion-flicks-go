import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { allMoods } from "@/data/movies";

type MoodSearchProps = {
  initial?: string;
  onSearch: (value: string) => void;
};

export default function MoodSearch({ initial = "", onSearch }: MoodSearchProps) {
  const [value, setValue] = useState(initial);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch(value);
  };

  return (
    <section aria-label="Mood search" className="w-full">
      <form onSubmit={submit} className="flex w-full max-w-2xl mx-auto gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search movies by mood, e.g. happy, calm, dark..."
          aria-label="Search movies by mood"
          className="h-12"
        />
        <Button type="submit" variant="hero" size="lg" className="h-12">
          Find Movies
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {allMoods.map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setValue(m.key);
              onSearch(m.key);
            }}
            aria-label={`Search ${m.label} movies`}
          >
            <Badge variant="secondary" className="cursor-pointer">
              {m.label}
            </Badge>
          </button>
        ))}
      </div>
    </section>
  );
}
