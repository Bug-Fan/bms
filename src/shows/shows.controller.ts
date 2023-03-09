import { Controller, Get, Post } from '@nestjs/common';


@Controller('shows')
export class ShowsController {

  // Role guard to be applied
  @Post()
  addShow() {

  }

  // Auth guard
  @Get()
  getShows() {

  }

  // Auth guard
  @Get()
  getAllMovies() { }
}
