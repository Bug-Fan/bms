import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { BookingRequestDto } from "src/dto/request/booking.request.dto";
import { CancelRequestDto } from "src/dto/request/cancel.request.dto";
import { BookingResoponseDto } from "src/dto/response/booking.response.dto";
import { CancelResponseDto } from "src/dto/response/cancel.response.dto";
import { RoleGuard } from "src/guards/role.guard";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { BookingService } from "./booking.service";

@ApiTags("Booking")
@UseInterceptors(LoggingInterceptor)
@UseGuards(AuthGuard("jwt"), new RoleGuard("user"))
@Controller("booking")
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post("book")
  @ApiBody({ type: BookingRequestDto })
  @ApiCreatedResponse({
    type: BookingResoponseDto,
    description: "Tickets Booked.",
  })
  @ApiNotFoundResponse({ description: "Show doesn't exist" })
  @ApiBadRequestResponse({
    description: "Invalid seat number in the booked seats.",
  })
  @ApiConflictResponse({
    description: "One of selected seats is already booked.",
  })
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
  @ApiOkResponse({
    type: CancelResponseDto,
    description: "Booking Canceled.",
  })
  @ApiNotFoundResponse({ description: "Booking cannot be found." })
  async cancelTickets(
    @Query() cancelRequestDto: CancelRequestDto,
    @Req() req
  ): Promise<CancelResponseDto> {
    return await this.bookingService.cancelBooking(
      cancelRequestDto,
      req.user.userId
    );
  }
}
