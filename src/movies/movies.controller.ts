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
import { MoviesService } from './movies.service';
import { CreateMovieFromApiDto } from './dto/create-movie-from-api.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/decorators/role.decorator';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Role('REGULAR')
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Public()
  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Role('ADMIN')
  @Post()
  createFromApi(@Body() dto: CreateMovieFromApiDto) {
    return this.moviesService.createFromApi(dto);
  }

  @Role('ADMIN')
  @Post('/new')
  createNewMovie(@Body() dto: CreateMovieDto) {
    return this.moviesService.createNewMovie(dto);
  }

  @Role('ADMIN')
  @Put('/:id')
  update(@Body() dto: UpdateMovieDto, @Param('id', ParseIntPipe) id: number) {
    return this.moviesService.update(dto, id);
  }

  @Role('ADMIN')
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.delete(id);
  }
}
