import * as moment from 'moment-timezone'
import { ApiProperty } from "@nestjs/swagger";

export class getShowsResponse {
  @ApiProperty({ type: Boolean, description: "Shows recieved in or not." })
  status: boolean;

  @ApiProperty({
    type: String,
    description: "Get show response message.",
    example: "Shows recieved.",
  })
  message: string;

  @ApiProperty({ type: Array, description: "Shows array." })
  shows: showObject[];

  constructor(status: boolean, message: string, shows: []) {
    this.status = status;
    this.message = message;
    this.shows = shows.map((item) => new showObject(item));
  }
}

export class showObject {
  @ApiProperty({
    type: "string",
    description: "Show Id",
    example: "d3cbb59b-998d-48a1-9e25-6f45364fc486",
  })
  showId;

  @ApiProperty({ type: Date, description: "Show date" })
  show_date;

  @ApiProperty({ type: "number", description: "Ticket price", example: 800 })
  price;

  @ApiProperty({
    type: "number",
    description: "Available seats",
    example: [1, 2, 3],
  })
  availableSeats;

  @ApiProperty({ type: "number", description: "Sceen number", example: 2 })
  screenId;

  @ApiProperty({ type: "string", description: "Movie name", example: "Fan" })
  movieName;

  @ApiProperty({ type: "string", description: "Movie details" })
  movieDescription;

  @ApiProperty({
    type: "string",
    description: "Movie audio language",
    example: "Hindi",
  })
  movieLanguage;

  @ApiProperty({ type: "string", description: "Start time" })
  startTime;

  constructor(obj){
    this.showId = obj.showId; 
    
   this.show_date = moment(obj.startDateTime).tz('Asia/Kolkata').format('');
   this.price = obj.price;
   this.availableSeats = obj.availableSeats ;
   this.screenId = obj.screenId;
   this.movieName = obj.movieName; 
   this.movieDescription = obj.movieDescription ;
   this.movieLanguage = obj.movieLanguage ;
   this.startTime = obj.startTime;
  }
}
