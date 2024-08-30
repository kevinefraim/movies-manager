import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';

export const movies = [
  {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'Movie Title',
    episodeId: 1,
    director: 'Director Name',
    producer: 'Producer Name',
    releaseDate: new Date(),
    openingCrawl: 'Opening Crawl Content',
  },
  {
    id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'Another Movie Title',
    episodeId: 2,
    director: 'Another Director Name',
    producer: 'Another Producer Name',
    releaseDate: new Date(),
    openingCrawl: 'Another Opening Crawl Content',
  },
];

export const movieDto: CreateMovieDto = {
  title: 'New Movie',
  director: 'Director',
  producer: 'Producer',
  releaseDate: '2022-01-01',
  openingCrawl: 'Opening Crawl',
  episodeId: 1,
};

export const MoviesApi = [
  {
    characters: ['Luke Skywalker'],
    created: '1977-05-25T04:23:48.623000Z',
    director: 'George Lucas',
    edited: '2014-12-15T22:18:55.167000Z',
    episode_id: 1,
    opening_crawl: 'desc',
    planets: ['s'],
    producer: 'Rick McCallum',
    release_date: '1977-05-25',
    species: ['s'],
    starships: ['s'],
    title: 'A New Hope',
    url: 'url.com',
    vehicles: ['s'],
  },
];
