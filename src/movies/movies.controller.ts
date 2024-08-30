import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { MoviesService } from 'movies/movies.service';
import { CreateMovieFromApiDto } from 'movies/dto/create-movie-from-api.dto';
import { UpdateMovieDto } from 'movies/dto/update-movie.dto';
import { CreateMovieDto } from 'movies/dto/create-movie.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { MovieEntity } from 'movies/entities/movie.entity';
import { Role } from 'common/decorators/role.decorator';
import { Public } from 'common/decorators/public.decorator';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Get details of a specific movie
  @Role('REGULAR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get details of a specific movie' })
  @ApiResponse({ status: 200, description: 'Movie found', type: MovieEntity })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  // Get a list of all movies
  @Public()
  @ApiOperation({ summary: 'Get a list of all movies' })
  @ApiResponse({
    status: 200,
    description: 'List of movies retrieved successfully',
    type: [MovieEntity],
  })
  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  // Create a new movie from the Star Wars API by episode ID
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new movie from the Star Wars API by episode ID',
  })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    type: MovieEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Episode does not exist' })
  @Post()
  createFromApi(@Body() dto: CreateMovieFromApiDto) {
    return this.moviesService.createFromApi(dto);
  }

  // Create a new movie manually
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new movie manually' })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    type: MovieEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('/new')
  createNewMovie(@Body() dto: CreateMovieDto) {
    return this.moviesService.createNewMovie(dto);
  }

  // Update details of an existing movie
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update details of an existing movie' })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
    type: MovieEntity,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Put('/:id')
  update(@Body() dto: UpdateMovieDto, @Param('id', ParseIntPipe) id: number) {
    return this.moviesService.update(dto, id);
  }

  // Delete a movie by ID
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a movie by ID' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.delete(id);
  }

  // Sync movies from Star Wars API to the database
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync movies from Star Wars API to the database' })
  @ApiResponse({ status: 200, description: 'Movies synchronized successfully' })
  @Post('/sync')
  syncMovies() {
    return this.moviesService.syncMoviesFromApi();
  }
}
