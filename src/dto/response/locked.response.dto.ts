export class LockedResponseDto {
  message: string;
  bookingId: string;

  constructor(message, bookingId) {
    this.message = message;
    this.bookingId = bookingId;
  }
}