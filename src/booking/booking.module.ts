import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { LockService } from "./lock.service";

@Module({
  controllers: [BookingController],
  providers: [BookingService, LockService],
})
export class BookingModule {}
