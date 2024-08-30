export type MoviesApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: MoviesApi[];
};

export type MoviesApi = {
  characters: string[];
  created: string;
  director: string;
  edited: string;
  episode_id: number;
  opening_crawl: string;
  planets: string[];
  producer: string;
  release_date: string;
  species: string[];
  starships: string[];
  title: string;
  url: string;
  vehicles: string[];
};
