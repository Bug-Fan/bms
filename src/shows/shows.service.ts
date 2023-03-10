import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Movie } from 'src/db/entities/movie.entity';
import { Screen } from 'src/db/entities/screen.entity';
import { Show } from 'src/db/entities/show.entity';
import { Slot } from 'src/db/entities/slot.entity';
import { AddShowDTO } from 'src/dto/request/addShow.dto';
import { SearchShowDTO } from 'src/dto/request/searchShow.dto';
import { AddShowResponse } from 'src/dto/response/addShowResponse.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ShowsService {
  constructor(
    @Inject('DataSource') private dataSource: DataSource
  ) { }

  async addShow(show: AddShowDTO): Promise<any> {

    const { movieId, date, price, screenId, slotId } = show;

    let showExists;
    let availableSeats;

    try {
      let qb = this.dataSource.manager.createQueryBuilder();

      showExists = await qb.from(Show, "show")
        .where("show.screenId = :scrid", { scrid: screenId })
        .andWhere("show.slotId = :sltID", { sltID: slotId })
        .andWhere("CAST (show.show_date AS DATE)= CAST (:myDate AS DATE)", { myDate: date }).execute();

      const screen = await this.dataSource.manager.findOneBy(Screen, { screenId })
      availableSeats = screen.maxCapacity;
    }
    catch (e) { throw new BadRequestException('Entered screen not available') }

    if (showExists && showExists.length <= 0) {

      try {
        await this.dataSource.manager.insert(Show, {
          movieId, show_date: date, price, screenId, slotId, availableSeats
        });
        return new AddShowResponse(true,"Show added successfuly")
      }

      catch (e) {
        throw new BadRequestException("Entered screen or slot not available")
      }
    }
    else
      throw new BadRequestException("Slot already have show");

  }

  async getShows(movieDTO: SearchShowDTO) {
    try {
      let queryBuilder = this.dataSource.manager.createQueryBuilder();
      let result = await queryBuilder.select("*").from(Show, "show").innerJoin("show.movie", 'mv').where("mv.movieName like :name", { name: movieDTO.movieName }).execute()
      
      return result;
    } 
    catch (e) {
      throw new BadRequestException(e.message)
    }
  }

}
