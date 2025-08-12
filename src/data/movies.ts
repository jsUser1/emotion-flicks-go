import happyPoster from "@/assets/posters/happy.jpg";
import sadPoster from "@/assets/posters/sad.jpg";
import energeticPoster from "@/assets/posters/energetic.jpg";
import calmPoster from "@/assets/posters/calm.jpg";
import romanticPoster from "@/assets/posters/romantic.jpg";
import darkPoster from "@/assets/posters/dark.jpg";
import adventurousPoster from "@/assets/posters/adventurous.jpg";
import thoughtfulPoster from "@/assets/posters/thoughtful.jpg";

export type Mood =
  | "happy"
  | "sad"
  | "energetic"
  | "calm"
  | "romantic"
  | "dark"
  | "adventurous"
  | "thoughtful";

export type Movie = {
  id: string;
  title: string;
  year: number;
  genres: string[];
  moodTags: Mood[];
  rating: number; // 0-10
  poster: string;
  synopsis: string;
};

export const allMoods: { key: Mood; label: string }[] = [
  { key: "happy", label: "Happy" },
  { key: "sad", label: "Sad" },
  { key: "energetic", label: "Energetic" },
  { key: "calm", label: "Calm" },
  { key: "romantic", label: "Romantic" },
  { key: "dark", label: "Dark" },
  { key: "adventurous", label: "Adventurous" },
  { key: "thoughtful", label: "Thoughtful" },
];

export const movies: Movie[] = [
  {
    id: "sunlit-smiles",
    title: "Sunlit Smiles",
    year: 2019,
    genres: ["Comedy", "Family"],
    moodTags: ["happy", "calm"],
    rating: 7.8,
    poster: happyPoster,
    synopsis: "A charming neighborhood bands together to turn a small kindness into a citywide celebration of joy.",
  },
  {
    id: "bokeh-days",
    title: "Bokeh Days",
    year: 2022,
    genres: ["Romance", "Comedy"],
    moodTags: ["happy", "romantic"],
    rating: 7.4,
    poster: happyPoster,
    synopsis: "Two strangers chase a list of serendipitous moments across a sun-drenched city.",
  },
  {
    id: "rain-on-glass",
    title: "Rain on Glass",
    year: 2016,
    genres: ["Drama"],
    moodTags: ["sad", "thoughtful"],
    rating: 8.1,
    poster: sadPoster,
    synopsis: "Through stormy seasons and quiet kitchens, a family learns to let go and love again.",
  },
  {
    id: "letters-never-sent",
    title: "Letters Never Sent",
    year: 2020,
    genres: ["Drama", "Romance"],
    moodTags: ["sad", "romantic"],
    rating: 7.9,
    poster: sadPoster,
    synopsis: "A shoebox of unsent letters finds its way back to their author, opening old wounds and new possibilities.",
  },
  {
    id: "neon-rush",
    title: "Neon Rush",
    year: 2023,
    genres: ["Action", "Thriller"],
    moodTags: ["energetic", "dark"],
    rating: 7.6,
    poster: energeticPoster,
    synopsis: "A courier races against a pulsing city clock to deliver a package that could save her brother.",
  },
  {
    id: "midnight-sprint",
    title: "Midnight Sprint",
    year: 2018,
    genres: ["Sport", "Drama"],
    moodTags: ["energetic"],
    rating: 7.2,
    poster: energeticPoster,
    synopsis: "An underdog relay team discovers their secret weapon is the rhythm they share off the track.",
  },
  {
    id: "still-waters",
    title: "Still Waters",
    year: 2015,
    genres: ["Drama"],
    moodTags: ["calm", "thoughtful"],
    rating: 8.3,
    poster: calmPoster,
    synopsis: "On an island where time feels slower, a writer untangles a mystery only she can sense.",
  },
  {
    id: "quiet-horizon",
    title: "Quiet Horizon",
    year: 2021,
    genres: ["Documentary"],
    moodTags: ["calm"],
    rating: 7.5,
    poster: calmPoster,
    synopsis: "A meditative journey across coastlines reveals how small habitats shape grand ecosystems.",
  },
  {
    id: "between-lanterns",
    title: "Between Lanterns",
    year: 2017,
    genres: ["Romance", "Drama"],
    moodTags: ["romantic", "happy"],
    rating: 8.0,
    poster: romanticPoster,
    synopsis: "Two travelers reunite every year beneath a bridge of floating lights, rewriting their story.",
  },
  {
    id: "after-the-waltz",
    title: "After the Waltz",
    year: 2014,
    genres: ["Romance"],
    moodTags: ["romantic", "thoughtful"],
    rating: 7.1,
    poster: romanticPoster,
    synopsis: "A choreographer finds the steps to love are learned between songs, not on stage.",
  },
  {
    id: "shadow-alleys",
    title: "Shadow Alleys",
    year: 2013,
    genres: ["Thriller", "Mystery"],
    moodTags: ["dark", "thoughtful"],
    rating: 8.2,
    poster: darkPoster,
    synopsis: "A detective follows a trail of light in a city that forgot how to glow.",
  },
  {
    id: "nocturne",
    title: "Nocturne",
    year: 2022,
    genres: ["Horror", "Mystery"],
    moodTags: ["dark"],
    rating: 6.9,
    poster: darkPoster,
    synopsis: "A composer hears a melody that only plays after midnight—and it wants to be finished.",
  },
  {
    id: "skybound",
    title: "Skybound",
    year: 2011,
    genres: ["Adventure", "Fantasy"],
    moodTags: ["adventurous", "happy"],
    rating: 7.7,
    poster: adventurousPoster,
    synopsis: "A map to floating islands sends three friends on a soaring rite of passage.",
  },
  {
    id: "salt-and-sand",
    title: "Salt & Sand",
    year: 2018,
    genres: ["Adventure"],
    moodTags: ["adventurous"],
    rating: 7.3,
    poster: adventurousPoster,
    synopsis: "An unexpected storm forces a coastal expedition to trust the tides—and each other.",
  },
  {
    id: "light-between-pages",
    title: "Light Between Pages",
    year: 2012,
    genres: ["Drama"],
    moodTags: ["thoughtful", "calm"],
    rating: 8.4,
    poster: thoughtfulPoster,
    synopsis: "A librarian uncovers marginalia that connects readers across decades.",
  },
  {
    id: "the-window-seat",
    title: "The Window Seat",
    year: 2020,
    genres: ["Drama"],
    moodTags: ["thoughtful", "sad"],
    rating: 7.8,
    poster: thoughtfulPoster,
    synopsis: "On a long overnight train, strangers share stories that change each other's destinations.",
  },
];

export function filterMoviesByMood(query: string): Movie[] {
  const q = query.trim().toLowerCase();
  if (!q) return movies.slice(0, 12);
  return movies.filter((m) =>
    m.moodTags.some((tag) => tag.includes(q)) ||
    m.title.toLowerCase().includes(q) ||
    m.genres.some((g) => g.toLowerCase().includes(q))
  );
}
