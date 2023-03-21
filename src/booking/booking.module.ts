import { Module } from "@nestjs/common";
import { EmailModule } from "src/email/email.module";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";

@Module({
  imports: [EmailModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
