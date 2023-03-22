import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Booking } from "src/db/entities/booking.entity";
import { Show } from "src/db/entities/show.entity";
import { DataSource } from "typeorm";

@Injectable()
export class LockService {
  constructor(@Inject("DataSource") private dataSource: DataSource) {}

  async releaseLock(showId, seats, bookingId) {
    try {
      const queryBuilder = this.dataSource.createQueryBuilder(Show, "show");

      const booking = await this.dataSource.manager.findOneBy(Booking, {
        bookingId,
      });

      let seatData = await queryBuilder
        .select(
          "show.availableSeats availableSeats, show.lockedSeats lockedSeats"
        )
        .where({ showId })
        .execute();

      let { availableseats, lockedseats } = seatData[0];

      lockedseats = lockedseats.filter((seat) => !seats.includes(seat));

      if (booking.paymentStatus) {
        availableseats = availableseats.filter((seat) => !seats.includes(seat));
      } else {
        const bookingDeleted = await this.dataSource.manager.delete(Booking, { bookingId });

        availableseats = availableseats.concat(seats);
      }

      const unlocked = await queryBuilder
        .update(Show)
        .set({ availableSeats: availableseats, lockedSeats: lockedseats })
        .where({ showId }).execute();

      if (unlocked) {
        console.log("Seats unlocked");
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Some error occurred in unlocking.");
    }
  }
}
