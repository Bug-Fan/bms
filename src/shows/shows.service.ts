import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Booking } from "src/db/entities/booking.entity";
import { Refund } from "src/db/entities/refund.entity";
import { Screen } from "src/db/entities/screen.entity";
import { Show } from "src/db/entities/show.entity";
import { AddShowDTO } from "src/dto/request/addShow.dto";
import { CancelShowDto } from "src/dto/request/cancel.show.dto";
import { SearchShowDTO } from "src/dto/request/searchShow.dto";
import { AddShowResponse } from "src/dto/response/addShowResponse.dto";
import { CancelResponseDto } from "src/dto/response/cancel.response.dto";
import { getShowsResponse } from "src/dto/response/getShowsResponse.dto";
import { DataSource, Between, EntityManager, InsertResult } from "typeorm";

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
          {
            screenId,
            startDateTime: Between(startDateTime, endDateTime),
            endDateTime: Between(startDateTime, endDateTime),
          },
        ],
      });
      const screen = await dbManager.findOneBy(Screen, { screenId });
      maxCapacity = screen.maxCapacity;
    } catch (e) {
      console.log(e);
      throw new BadRequestException("Entered screen not available");
    }

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
    } else throw new BadRequestException("Slot already has show");
  }

  async getShows(movieDTO: SearchShowDTO) {
    let result;
    try {
      let queryBuilder = this.dataSource.manager.createQueryBuilder();
      result = await queryBuilder
        .from(Show, "show")
        .innerJoin("show.movie", "mv")
        .where("mv.movieName like :name", { name: movieDTO.movieName })
        .andWhere(
          "CAST (show.startDateTime AS DATE) >= CAST (:myDate AS DATE)",
          {
            myDate: new Date(),
          }
        )
        .execute();
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
        const refundInitiated = await this.dataSource.manager.transaction(
          async (em: EntityManager): Promise<InsertResult> => {
            
            const bookings = await em.find(Booking, {
              select: { bookingId: true },
              where: { showId },
            });

            await em.update(
              Booking,
              { showId, isCanceled: false },
              { isCanceled: true }
            );

            const refunds = bookings.map((element) => {
              return em.create(Refund, {
                bookingId: element.bookingId,
              });
            });

            const refundInitiated = await em.insert(Refund, refunds);

            return refundInitiated;
          }
        );

        if (refundInitiated.identifiers.length >= 1) {
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
