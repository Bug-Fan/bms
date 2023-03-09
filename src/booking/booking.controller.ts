import { Body, Controller, Delete, Post, Query, Req } from '@nestjs/common';
import { BookingRequestDto } from 'src/dto/request/booking.request.dto';
import { CancelTicketsRequestDto } from 'src/dto/request/cancel.tickets.request.dto';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  // @Get('shows')
  // @Redirect('localhost:3000/shows/get')
  // getShows() {
  //   return;
  // }

  @Post('book')
  async bookTickets(@Body() bookingRequestDto: BookingRequestDto, @Req() req) {
    return await this.bookingService.bookTickets(
      bookingRequestDto,
      req.user?.userId,
    );
  }

  @Delete('cancel')
  async cancelTickets(
    @Query() cancelTicketsRequestDto: CancelTicketsRequestDto,
  ) {
    return await this.bookingService.cancelTickets(cancelTicketsRequestDto);
  }
}
