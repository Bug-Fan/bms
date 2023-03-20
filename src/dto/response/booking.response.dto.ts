import * as moment from "moment-timezone";
import { ApiProperty } from "@nestjs/swagger";

export class BookingResoponseDto {
  @ApiProperty({
    type: String,
    description: "Booking Id.",
    example: "d3cbb59b-998d-48a1-9e25-6f45364fc486",
  })
  bookingId: string;

  @ApiProperty({ type: String, description: "Movie name.", example: "Fan" })
  movieName: string;
  
  @ApiProperty({ type: Date, description: "Show date." })
  showDate: string;

  @ApiProperty({ type: Number, description: "Screen number.", example: 1 })
  screenId: number;

  @ApiProperty({
    type: String,
    description: "Screen name.",
    example: "Shivaji",
  })
  screenName: string;

  @ApiProperty({
    type: Array(Number),
    description: "Seats booked.",
    example: [1, 2, 3],
  })
  seats: number[];
  totalPrice: number;
  isCanceled:boolean;
  constructor(confirmed) {
    const { bookingId, movieName,isCanceled, startDateTime, screenId, screenName, seats, totalPrice } = confirmed;
    this.bookingId = bookingId;
    this.movieName = movieName;
    this.isCanceled = isCanceled;
    this.showDate = moment(startDateTime).tz("Asia/Kolkata").format("");
    this.screenId = screenId;
    this.screenName = screenName;
    this.seats = seats;
    this.totalPrice = totalPrice;
  }
}
