import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Booking } from 'src/db/entities/booking.entity';
import { Show } from 'src/db/entities/show.entity';
import { BookingRequestDto } from 'src/dto/request/booking.request.dto';
import { CancelTicketsRequestDto } from 'src/dto/request/cancel.tickets.request.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(@Inject('DataSource') private dataSource: DataSource) {}

  async bookTickets(bookingRequestDto: BookingRequestDto, userId) {
    const { showId, seats } = bookingRequestDto;
    const paymentStatus = false;
    try {
      const bookings = await this.dataSource.manager.findBy(Booking, {
        showId,
      });
      const bookedSeats = [];
      bookings.forEach((booking) => {
        bookedSeats.push(...booking.seats);
      });
      const conflictingSeats = seats.filter((seat) =>
        bookedSeats.includes(seat),
      );
      if (conflictingSeats.length === 0) {
        const booked = await this.dataSource.manager.insert(Booking, {
          userId,
          showId,
          seats,
          paymentStatus,
        });
        const updated = await this.dataSource.manager.decrement(
          Show,
          { showId },
          'availableSeats',
          booked.raw[0].seats.length,
        );
        return booked.raw;
      } else {
        throw new ConflictException();
      }
    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException(
          'One of your selected seats is already booked.',
        );
      }
      console.log(error);
    }
  }

  async cancelTickets(cancelTicketsRequestDto: CancelTicketsRequestDto) {
    const { bookingId } = cancelTicketsRequestDto;

    try {
      // const booking = await this.dataSource.manager.findBy(Booking, {
      //   bookingId,
      // });
      const booking = await this.dataSource
        .createQueryBuilder(Booking, 'booking')
        .where('booking.bookingId= :bookingId', { bookingId })
        .getOne();

      console.log(booking);
      // const numberOfSeats = booking.seats.length;
      // console.log(booking);
      // const canceled = await this.dataSource.manager.delete(Booking, {
      //   bookingId,
      // });
      // const updated = await this.dataSource.manager.increment(
      //   Show,
      //   { showId: booking.showId },
      //   'availableSeats',
      //   numberOfSeats,
      // );
      // return canceled;
    } catch (error) {
      console.log(error);
    }
  }
}
