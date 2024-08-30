import { Movie } from '@prisma/client';
import { MoviesApi } from 'movies/types/movies.types';

export const movieStub = (): Movie => {
  return {
    id: 1,
    title: 'A New Hope',
    director: 'George Lucas',
    producer: 'Gary Kurtz, Rick McCallum',
    episodeId: 4,
    releaseDate: new Date('1977-05-25'),
    openingCrawl: 'It is a period of civil war...',
    createdAt: new Date('2021-01-01T00:00:00.000Z'),
    updatedAt: new Date('2021-01-01T00:00:00.000Z'),
  };
};

export const movieApiStub = (): MoviesApi => {
  return {
    characters: [],
    created: new Date().toISOString(),
    edited: new Date().toISOString(),
    episode_id: 4,
    title: 'A New Hope',
    director: 'George Lucas',
    producer: 'Gary Kurtz, Rick McCallum',
    release_date: '1977-05-25',
    opening_crawl: 'It is a period of civil war...',
    planets: [],
    species: [],
    starships: [],
    vehicles: [],
    url: 'http://swapi.dev/api/films/1/',
  };
};
