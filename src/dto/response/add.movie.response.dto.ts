export class AddMovieResponseDto {
  status: boolean;
  message: string;

  constructor(status, message){
    this.status = status;
    this.message = message;
  }
}