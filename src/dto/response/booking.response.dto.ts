import * as moment from "moment-timezone";

export class BookingResoponseDto {
  bookingId: string;
  movieName: string;
  showDate: string;
  screenId: number;
  screenName: string;
  seats: number[];
  totalPrice: number;

  constructor(confirmed) {
    const { bookingId, movieName, startDateTime, startTime, screenId, screenName, seats, totalPrice } = confirmed;
    this.bookingId = bookingId;
    this.movieName = movieName;
    this.showDate = moment(startDateTime).tz("Asia/Kolkata").format("");
    this.screenId = screenId;
    this.screenName = screenName;
    this.seats = seats;
    this.totalPrice = totalPrice;
  }
}
