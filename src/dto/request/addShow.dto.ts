import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsUUID, IsInt } from "class-validator";

export class AddShowDTO {
  @ApiProperty({
    name: "movieId",
    description: "Id of movie to added in show.",
    type: "string",
    required: true,
    example: "d3cbb59b-998d-48a1-9e25-6f45364fc486",
  })
  @IsUUID()
  movieId: string;

  @ApiProperty({
    name: "screenId",
    description: "Id of screen which will display show.",
    type: "integer",
    required: true,
    example: 1,
  })
  @IsInt()
  @IsNumber()
  screenId: number;

 
  @ApiProperty({
    name: "date",
    description: "date on which the movie will be shown",
    type: "date",
    required: true,
  })
  @IsDateString()
  startDateTime: Date;

  @IsDateString()
  endDateTime: Date;

  @ApiProperty({
    name: "price",
    description: "Price of the ticket.",
    type: "number",
    required: true,
    example: 800,
  })
  @IsNumber()
  price: number;
}
