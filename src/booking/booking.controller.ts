import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BookingRequestDto } from "src/dto/request/booking.request.dto";
import { CancelRequestDto } from "src/dto/request/cancel.request.dto";
import { BookingResoponseDto } from "src/dto/response/booking.response.dto";
import { RoleGuard } from "src/guards/role.guard";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { BookingService } from "./booking.service";

@UseInterceptors(LoggingInterceptor)
@UseGuards(AuthGuard("jwt"), new RoleGuard("user"))
@Controller("booking")
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post("book")
  async bookTickets(
    @Body() bookingRequestDto: BookingRequestDto,
    @Req() req
  ): Promise<BookingResoponseDto> {
    return await this.bookingService.bookTickets(
      bookingRequestDto,
      req.user.userId
    );
  }

  @Delete("cancel")
  async cancelTickets(@Query() cancelRequestDto: CancelRequestDto, @Req() req) {
    return await this.bookingService.cancelBooking(
      cancelRequestDto,
      req.user.userId
    );
  }

  @Get("bookings")
  async getAllBookings(@Req() req) {
    return await this.bookingService.getAllBookings(req.user.userId);
  }
}
