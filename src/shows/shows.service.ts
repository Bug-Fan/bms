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
import { AvailableSeatDto } from "src/dto/request/availableseat.dto";
import { CancelShowDto } from "src/dto/request/cancel.show.dto";
import { SearchShowDTO } from "src/dto/request/searchShow.dto";
import { AddShowResponse } from "src/dto/response/addShowResponse.dto";
import { CancelResponseDto } from "src/dto/response/cancel.response.dto";
import { getShowsResponse } from "src/dto/response/getShowsResponse.dto";
import {
  DataSource,
  Between,
  EntityManager,
  InsertResult,
  Brackets,
} from "typeorm";

const take = 10;
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
      let qb = await dbManager.createQueryBuilder();
      showExists = await qb
        .from(Show, "show")
        .where("show.screenId = :scrid")
        .andWhere(
          new Brackets((qb) => {
            qb.where("(show.startDateTime BETWEEN :start AND :end)").orWhere(
              "(show.endDateTime BETWEEN :start AND :end)"
            );
          })
        )
        .andWhere("show.isActive = true")
        .setParameters({
          scrid: screenId,
          start: startDateTime,
          end: endDateTime,
        })
        .execute();

      const screen = await dbManager.findOneBy(Screen, { screenId });
      maxCapacity = screen.maxCapacity;
    } catch (e) {
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
    const { page, movieName } = movieDTO;
    try {
      let queryBuilder = this.dataSource.manager.createQueryBuilder();

      queryBuilder
        .from(Show, "show")
        .innerJoin("show.movie", "mv")
        .innerJoin("show.screen", "scr")
        .where("show.startDateTime  >= :myDate ", {
          myDate: new Date(),
        })
        .andWhere("show.isActive = true")
        .orderBy("show.startDateTime", "ASC")
        .limit(take)
        .offset(take * (page - 1) || 0);

      if (movieDTO.movieName)
        queryBuilder.andWhere("mv.movieName like :name", {
          name: movieName,
        });

      result = await queryBuilder.execute();
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    if (result && result.length > 0)
      return new getShowsResponse(true, "Shows fetched", result);
    else throw new NotFoundException("Shows do not exists");
  }

  async cancelShow(cancelShowDto: CancelShowDto): Promise<CancelResponseDto> {
    const { showId } = cancelShowDto;

    try {
      return await this.dataSource.manager.transaction(
        async (em: EntityManager): Promise<CancelResponseDto> => {
          const showCanceled = await em.update(
            Show,
            { showId, isActive: true },
            { isActive: false }
          );

          if (showCanceled.affected <= 0) {
            throw new NotFoundException();
          }

          const bookings = await em.find(Booking, {
            select: { bookingId: true },
            where: { showId, isCanceled: false },
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

          await em.insert(Refund, refunds);

          return new CancelResponseDto(
            true,
            "Show has been canceled and refund is initiated for all bookings."
          );
        }
      );
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

  async getAvailableSeats(availableSeatDto: AvailableSeatDto) {
    let result;
    try {
      result = await this.dataSource.manager.findOne(Show, {
        select: { availableSeats: true },
        where: { showId: availableSeatDto.showId,isActive:true },
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
    
    if (result) return result;
    else throw new NotFoundException(`Show doesn't exist`);
  }
}
