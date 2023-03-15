import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Booking } from "src/db/entities/booking.entity";
import { Movie } from "src/db/entities/movie.entity";
import { Refund } from "src/db/entities/refund.entity";
import { Screen } from "src/db/entities/screen.entity";
import { Show } from "src/db/entities/show.entity";
import { AddShowDTO } from "src/dto/request/addShow.dto";
import { CancelShowDto } from "src/dto/request/cancel.show.dto";
import { SearchShowDTO } from "src/dto/request/searchShow.dto";
import { AddShowResponse } from "src/dto/response/addShowResponse.dto";
import { CancelResponseDto } from "src/dto/response/cancel.response.dto";
import { getShowsResponse } from "src/dto/response/getShowsResponse.dto";
import { DataSource, Between, Like, FindOperator } from "typeorm";

@Injectable()
export class ShowsService {
  constructor(@Inject("DataSource") private dataSource: DataSource) {}

  async addShow(show: AddShowDTO): Promise<AddShowResponse> {
    const dbManager = this.dataSource.manager;
    let { movieId, endDateTime, startDateTime, price, screenId } = show;

    startDateTime = new Date(startDateTime);
    endDateTime = new Date(endDateTime);
    let showExists, maxCapacity, availableSeats;

    try {
      showExists = await dbManager.find(Show, {
        where: [
          { startDateTime: Between(startDateTime, endDateTime) },
          { endDateTime: Between(startDateTime, endDateTime) },
        ],
      });
      const screen = await dbManager.findOneBy(Screen, { screenId });
      maxCapacity = screen.maxCapacity;
    } catch (e) {
      console.log(e);
      throw new BadRequestException("Entered screen not available");
    }
    console.log(showExists);
    if (showExists && showExists.length <= 0 && maxCapacity) {
      availableSeats = [...Array(+maxCapacity).keys()].map((x) => ++x);
      try {
        await dbManager.insert(Show, {
          movieId,
          startDateTime,
          endDateTime,
          price,
          screenId,
          availableSeats,
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

      queryBuilder
        .from(Show, "show")
        .innerJoin("show.movie", "mv")
        .innerJoin("show.screen", "scr")
        .where("show.startDateTime  >= :myDate ", {
          myDate: new Date(),
        });
      
      if (movieDTO.movieName)
        queryBuilder.andWhere("mv.movieName like :name", {
          name: movieDTO.movieName,
        });

      result = await queryBuilder.execute();
    
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    if (result && result.length > 0)
      return new getShowsResponse(true, "Shows fetched", result);
    else throw new NotFoundException("Shows do not exists on given movie name");
  }

  async cancelShow(cancelShowDto: CancelShowDto) {
    const { showId } = cancelShowDto;

    try {
      const showCanceled = await this.dataSource.manager.update(
        Show,
        { showId, isActive: true },
        { isActive: false }
      );

      if (showCanceled.affected === 1) {
        const bookings = await this.dataSource.manager.find(Booking, {
          select: { bookingId: true },
          where: { showId },
        });

        const refunds = bookings.map((element) => {
          return this.dataSource.manager.create(Refund, {
            bookingId: element.bookingId,
            refundStatus: false,
          });
        });

        const refundInitiated = await this.dataSource.manager.insert(
          Refund,
          refunds
        );

        if (refundInitiated) {
          return new CancelResponseDto(
            true,
            "Show has been canceled and refund is initiated for all bookings."
          );
        }
      } else {
        throw new NotFoundException();
      }
      
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(
          "The show you entered does not exist or is already canceled."
        );
      } else {
        throw new BadRequestException("Unable to cancel show.");
      }
    }
  }
}
