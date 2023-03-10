import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Booking } from "src/db/entities/booking.entity";
import { Show } from "src/db/entities/show.entity";
import { BookingRequestDto } from "src/dto/request/booking.request.dto";
import { CancelRequestDto } from "src/dto/request/cancel.request.dto";
import { DataSource } from "typeorm";
import { BookingResoponseDto } from "src/dto/response/booking.response.dto";
import { CancelResponseDto } from "src/dto/response/cancel.response.dto";

@Injectable()
export class BookingService {
  constructor(@Inject("DataSource") private dataSource: DataSource) {}

  async bookTickets(
    bookingRequestDto: BookingRequestDto,
    userId
  ): Promise<BookingResoponseDto> {
    const { showId, seats } = bookingRequestDto;
    try {
      // const validShow = await this.validateShow(showId);
      const validSeats = await this.validateSeats(showId, seats);
      let booked;

      if (validSeats) {
        booked = await this.dataSource.manager.insert(Booking, {
          userId,
          showId,
          seats,
          paymentStatus: true,
        });
        const updated = await this.dataSource.manager.decrement(
          Show,
          { showId },
          "availableSeats",
          booked.raw[0].seats.length
        );
      }

      const { bookingId } = booked.raw[0];
      console.log(bookingId);
      const confirmed = await this.dataSource.manager
        .createQueryBuilder()
        .select(
          "booking.bookingId, booking.seats, movie.movieName, slot.startTime, show.show_date, screen.screenId, screen.screenName"
        )
        .from(Booking, "booking")
        .innerJoin("booking.show", "show")
        .innerJoin("show.slot", "slot")
        .innerJoin("show.movie", "movie")
        .innerJoin("show.screen", "screen")
        .where("booking.bookingId=:bookingId", { bookingId })
        .execute();
      return new BookingResoponseDto(confirmed[0]);
    } catch (error) {
      console.log(error);
      if (error.status === 404) {
        throw new NotFoundException("The show you selected doesn't exist.");
      } else if (error.status === 400) {
        throw new BadRequestException(
          "Invalid seat number in the booked seats."
        );
      } else if (error.status === 409) {
        throw new ConflictException(
          "One your selected seats is already booked."
        );
      }
    }
  }

  async cancelBooking(cancelTicketsRequestDto: CancelRequestDto) {
    const { bookingId } = cancelTicketsRequestDto;

    try {
      const booking = await this.dataSource.manager.findOneBy(Booking, {
        bookingId,
      });
      if (!booking) {
        throw new NotFoundException();
      }
      const numberOfSeats = booking.seats.length;
      const canceled = await this.dataSource.manager.delete(Booking, {
        bookingId,
      });
      const updated = await this.dataSource.manager.increment(
        Show,
        { showId: booking.showId },
        "availableSeats",
        numberOfSeats
      );
      if (canceled.affected === 1) {
        return new CancelResponseDto(
          true,
          "Your booking has been canceled."
        );
      }
    } catch (error) {
      console.log(error);
      if (error.status === 404) {
        throw new NotFoundException("Your booking cannot be found");
      }
    }
  }

  async validateSeats(showId, seats) {
    try {
      const qb = this.dataSource.manager.createQueryBuilder();
      let result = await qb
        .select("screen.maxCapacity")
        .from(Show, "show")
        .innerJoin("show.screen", "screen")
        .where("show.showId=:showId", { showId })
        .execute();
      if (result.length === 0) {
        throw new NotFoundException();
      } else if (Math.max(seats) > result[0].screen_maxCapacity) {
        throw new BadRequestException();
      } else {
        const bookings = await this.dataSource.manager.findBy(Booking, {
          showId,
        });
        if (!bookings) {
          throw new NotFoundException();
        }
        const bookedSeats = [];
        bookings.forEach((booking) => {
          bookedSeats.push(...booking.seats);
        });
        const conflictingSeats = seats.filter((seat) =>
          bookedSeats.includes(seat)
        );
        if (conflictingSeats.length === 0) {
          return true;
        } else {
          throw new ConflictException();
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // async validateShow(showId) {
  //   try {
  //     const valid = await this.dataSource.manager.createQueryBuilder().select('show.show_date, slot.startTime').from(Show, 'show').innerJoin('show.slot', 'slot').where('show.showId=:showId', { showId }).execute();
  //     const showDate = new Date(valid[0].show_date);
  //     const currentDate = new Date();
  //     console.log(showDate.getDate(), currentDate.getDate(), showDate.getMonth(), currentDate.getMonth(), showDate.getFullYear(), currentDate.getFullYear());

  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async bookTickets(bookingRequestDto: BookingRequestDto, userId) {
  //   const { showId, seats } = bookingRequestDto;
  //   const paymentStatus = false;
  //   try {
  //     const bookings = await this.dataSource.manager.findBy(Booking, {
  //       showId,
  //     });
  //     const bookedSeats = [];
  //     bookings.forEach((booking) => {
  //       bookedSeats.push(...booking.seats);
  //     });
  //     const conflictingSeats = seats.filter((seat) =>
  //       bookedSeats.includes(seat),
  //     );
  //     if (conflictingSeats.length === 0) {
  //       const booked = await this.dataSource.manager.insert(Booking, {
  //         userId,
  //         showId,
  //         seats,
  //         paymentStatus,
  //       });
  //       const updated = await this.dataSource.manager.decrement(
  //         Show,
  //         { showId },
  //         'availableSeats',
  //         booked.raw[0].seats.length,
  //       );
  //       return booked.raw;
  //     } else {
  //       throw new ConflictException();
  //     }
  //   } catch (error) {
  //     if (error.status === 409) {
  //       throw new ConflictException(
  //         'One of your selected seats is already booked.',
  //       );
  //     }
  //     console.log(error);
  //   }
  // }

  // async cancelTickets(cancelTicketsRequestDto: CancelTicketsRequestDto) {
  //   const { bookingId } = cancelTicketsRequestDto;

  //   try {
  //     const booking = await this.dataSource.manager.findOneBy(Booking, {
  //       bookingId,
  //     });
  //     console.log(booking);
  //     const numberOfSeats = booking.seats.length;
  //     console.log(booking);
  //     const canceled = await this.dataSource.manager.delete(Booking, {
  //       bookingId,
  //     });
  //     const updated = await this.dataSource.manager.increment(
  //       Show,
  //       { showId: booking.showId },
  //       'availableSeats',
  //       numberOfSeats,
  //     );
  //     return canceled;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async conflict() {
  //   const bookings = await this.dataSource.manager.findBy(Booking, {
  //     showId,
  //   });
  //   const bookedSeats = [];
  //   bookings.forEach((booking) => {
  //     bookedSeats.push(...booking.seats);
  //   });
  // }
}