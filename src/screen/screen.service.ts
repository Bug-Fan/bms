import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Movie } from 'src/db/entities/movie.entity';
import { Screen } from 'src/db/entities/screen.entity';
import { AddMovieDto } from 'src/dto/request/addmovie.request.dto';
import { AddScreenDTO } from 'src/dto/request/addscreen.dto';
import { AddMovieResponseDto } from 'src/dto/response/add.movie.response.dto';
import { AddScreenResponsedto } from 'src/dto/response/addscreenresponse.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ScreenService {
  constructor(@Inject("DataSource") private dataSource: DataSource) {}

  async addScreen(ScreenDTO: AddScreenDTO) {
    try {
      let screen = await this.dataSource.manager.insert(Screen, {
        maxCapacity: ScreenDTO.maxCapacity,
        screenName: ScreenDTO.screenName,
      });
      return new AddScreenResponsedto(
        true,
        `Screen ${ScreenDTO.screenName} added`
      );
    } catch (e) {
      throw new BadRequestException("Cannot add new screen.");
    }
  }

  async addMovie(addmovieDto: AddMovieDto): Promise<AddMovieResponseDto> {
    try {
      const addedMovie = await this.dataSource.manager.insert(Movie, addmovieDto);
      if (addedMovie.identifiers.length > 0) {
        return new AddMovieResponseDto(true, "Movie added successfuly.");
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Unable to add movie.");
    }
  }
}
