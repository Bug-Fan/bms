export class BookingResoponseDto {
  bookingId: string;
  movieName: string;
  showDate: Date;
  startTime: string;
  screenId: number;
  screenName: string;
  seats: number[];

  constructor(confirmed) {
    const { bookingId, movieName, show_date, startTime, screenId, screenName, seats } = confirmed;
    this.bookingId = bookingId;
    this.movieName = movieName;
    this.showDate = show_date;
    this.startTime = startTime;
    this.screenId = screenId;
    this.screenName = screenName;
    this.seats = seats;
  }
}
