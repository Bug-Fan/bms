import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Movie } from "src/db/entities/movie.entity";
import { Screen } from "src/db/entities/screen.entity";
import { Show } from "src/db/entities/show.entity";
import { Slot } from "src/db/entities/slot.entity";
import { AddShowDTO } from "src/dto/request/addShow.dto";
import { SearchShowDTO } from "src/dto/request/searchShow.dto";
import { AddShowResponse } from "src/dto/response/addShowResponse.dto";
import { getShowsResponse } from "src/dto/response/getShowsResponse.dto";
import { DataSource,Between } from "typeorm";

@Injectable()
export class ShowsService {
  constructor(@Inject("DataSource") private dataSource: DataSource) {}

  async addShow(show: AddShowDTO): Promise<AddShowResponse> {
    const dbManager = this.dataSource.manager;
    let { movieId, endDateTime, startDateTime, price, screenId } = show;

    startDateTime = new Date(startDateTime);
    endDateTime = new Date(endDateTime);
    let showExists;
    let availableSeats;

    try {
    
      showExists = await dbManager.find(Show, {
        where: [
          {start_date_time: Between(startDateTime, endDateTime)},
          {end_date_time: Between(startDateTime, endDateTime)},
        ],
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException("Entered screen not available");
    }
    console.log(startDateTime,endDateTime);
    if (showExists && showExists.length <= 0) {
      try {
        await dbManager.insert(Show, {
          movieId,
          start_date_time: startDateTime,
          end_date_time: endDateTime,
          price,
          screenId,
          availableSeats:200,
        });
        return new AddShowResponse(true, "Show added successfuly");
      } catch (e) {
        throw new BadRequestException("Entered movie not found");
      }
    } else throw new BadRequestException("Slot already have show");
  }

  async getShows(movieDTO: SearchShowDTO) {
    let result;
    try {
      let queryBuilder = this.dataSource.manager.createQueryBuilder();
      result = await queryBuilder
        .select("*")
        .from(Show, "show")
        .innerJoin("show.movie", "mv")
        .innerJoin("show.slot", "slot")
        .where("mv.movieName like :name", { name: movieDTO.movieName })
        .andWhere("CAST (show.show_date AS DATE) >= CAST (:myDate AS DATE)", {
          myDate: new Date(),
        })
        .execute();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
    if (result && result.length > 0)
      return new getShowsResponse(true, "Shows fetched", result);
    else throw new NotFoundException("Shows do not exists on given movie name");
  }
}
