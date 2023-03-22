import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Booking } from "src/db/entities/booking.entity";
import { Show } from "src/db/entities/show.entity";
import { BookingRequestDto } from "src/dto/request/booking.request.dto";
import { CancelRequestDto } from "src/dto/request/cancel.request.dto";
import { DataSource, EntityManager, InsertResult } from "typeorm";
import { BookingResoponseDto } from "src/dto/response/booking.response.dto";
import { CancelResponseDto } from "src/dto/response/cancel.response.dto";
import { Refund } from "src/db/entities/refund.entity";
import { LockService } from "./lock.service";
import { LockedResponseDto } from "src/dto/response/locked.response.dto";
import { EmailService } from "src/email/email.service";

@Injectable()
export class BookingService {
  constructor(
    @Inject("DataSource") private dataSource: DataSource,
    private lockService: LockService,
    private emailService:EmailService
  ) {}

  async bookTickets(
    bookingRequestDto: BookingRequestDto,
    userId
  ): Promise<LockedResponseDto> {
    const { showId, seats } = bookingRequestDto;

    try {
      const validShowAndSeats = await this.validateShowAndSeats(showId, seats);
      const { currentseats, seatsavailable, price } = validShowAndSeats;

      if (seatsavailable === true) {
        const transactionComplete = await this.dataSource.manager.transaction(
          async (em: EntityManager): Promise<any> => {
            const booking = await em.insert(Booking, {
              userId,
              showId,
              seats,
              paymentStatus: false,
              totalPrice: price * seats.length,
            });

            await em
              .createQueryBuilder(Show, "show")
              .update(Show)
              .set({
                availableSeats: currentseats,
                lockedSeats: () => 'array_cat("lockedSeats", :seats)',
              })
              .where({ showId })
              .setParameters({ seats })
              .execute();

            return {
              bookingId: booking.identifiers[0].bookingId,
              status: true,
            };
          }
        );
        if (transactionComplete.status) {
          const bookingId = transactionComplete.bookingId;
          const timer = setTimeout(
            () => this.lockService.releaseLock(showId, seats, bookingId),
            20000
          );
          return new LockedResponseDto("You can go to Payment.", bookingId);
        } else {
          throw new BadGatewayException();
        }
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException("The show you selected doesn't exist.");
      } else if (error.status === 400) {
        throw new BadRequestException(
          "Invalid seat number in the booked seats or one your selected seats is not available."
        );
      } else {
        console.log(error);
        throw new BadGatewayException("Unable to confirm your booking.");
      }
    }
  }

  async cancelBooking(
    cancelTicketsRequestDto: CancelRequestDto,
    userId
  ): Promise<CancelResponseDto> {
    const { bookingId } = cancelTicketsRequestDto;

    try {
      const booking = await this.dataSource.manager.findOneBy(Booking, {
        bookingId,
        userId,
        isCanceled: false,
      });

      if (booking) {
        const canceled = await this.dataSource.transaction(
          async (em: EntityManager): Promise<InsertResult> => {
            const canceled = await em.update(
              Booking,
              {
                bookingId,
              },
              { isCanceled: true }
            );

            const updated = await em
              .createQueryBuilder(Show, "show")
              .update(Show)
              .set({
                availableSeats: () => 'array_cat("availableSeats", :seats)',
              })
              .setParameters({ seats: booking.seats })
              .execute();

            const refundInitiated = await em.insert(Refund, {
              bookingId,
            });

            return refundInitiated;
          }
        );

        if (canceled.generatedMaps.length >= 1) {
          return new CancelResponseDto(
            true,
            "Your booking has been canceled and refund has been initiated."
          );
        }
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      console.log(error);
      if (error.status === 404) {
        throw new NotFoundException(
          "Your booking cannot be found or your booking is already canceled."
        );
      }
    }
  }

  async getAllBookings(userId): Promise<BookingResoponseDto[]> {
    try {
      let allBookings = [];
      const bookings = await this.dataSource.manager.findBy(Booking, {
        userId,
      });

      if (bookings.length > 0) {
        for (let i = 0; i < bookings.length; i++) {
          const ticket = await this.generateTicket(bookings[i].bookingId);
          allBookings.push(new BookingResoponseDto(ticket));
        }
        return allBookings;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException("No bookings found for you.");
    }
  }

  async pay(bookingId, userId): Promise<BookingResoponseDto> {
    try {
      const details = await this.dataSource.manager.findOneBy(Booking, {
        bookingId,
        userId,
      });

      const paid = await this.dataSource.manager.update(
        Booking,
        { bookingId },
        { paymentStatus: true }
      );

      if (details && paid.affected === 1) {
        const { showId, seats } = details;
        this.lockService.releaseLock(showId, seats, bookingId);

        const confirmedBooking = await this.generateTicket(bookingId);
        return new BookingResoponseDto(confirmedBooking);
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        "Booking not found or payment is not confirmed."
      );
    }
  }

  async validateShowAndSeats(showId, seats) {
    try {
      let result = await this.dataSource.manager
        .createQueryBuilder()
        .select(
          "screen.maxCapacity, show.availableSeats currentSeats, show.availableSeats @> :seats seatsAvailable, show.lockedSeats @> :seats seatsLocked, show.price price"
        )
        .from(Show, "show")
        .innerJoin("show.screen", "screen")
        .where("show.showId=:showId")
        .andWhere("show.startDateTime > :date")
        .andWhere("show.isActive = true")
        .setParameters({ seats, showId, date: new Date() })
        .execute();
        console.log(result[0]);
      if (result.length === 0) {
        throw new NotFoundException();
      } else if (
        Math.max(seats) > result[0].maxCapacity ||
        !result[0].seatsavailable ||
        result[0].seatslocked
      ) {
        throw new BadRequestException();
      } else {
        result[0].currentseats = result[0].currentseats.filter(
          (seat) => !seats.includes(seat)
        );
        return result[0];
      }
    } catch (error) {
      throw error;
    }
  }

  async generateTicket(bookingId) {
    try {
      const confirmed = await this.dataSource.manager
        .createQueryBuilder()
        .select(
          'booking.bookingId,"booking"."isCanceled", booking.seats, movie.movieName, show.startDateTime, screen.screenId, screen.screenName, booking.totalPrice'
        )
        .from(Booking, "booking")
        .innerJoin("booking.show", "show")
        .innerJoin("show.movie", "movie")
        .innerJoin("show.screen", "screen")
        .where("booking.bookingId=:bookingId", { bookingId })
        .execute();

      if (confirmed) {
        return confirmed[0];
      }
    } catch (error) {
      console.log(error);
      throw new BadGatewayException("Unable to generate your ticket.");
    }
  }
}
