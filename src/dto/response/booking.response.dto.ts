import * as moment from "moment-timezone";

export class BookingResoponseDto {
  bookingId: string;
  movieName: string;
  showDate: string;
  startTime: string;
  screenId: number;
  screenName: string;
  seats: number[];

  constructor(confirmed) {
    const { bookingId, movieName, startDateTime, startTime, screenId, screenName, seats } = confirmed;
    this.bookingId = bookingId;
    this.movieName = movieName;
    this.showDate = moment(startDateTime).tz("Asia/Kolkata").format("");
    this.startTime = startTime;
    this.screenId = screenId;
    this.screenName = screenName;
    this.seats = seats;
  }
}
