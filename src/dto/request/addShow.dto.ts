import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsUUID, IsInt } from "class-validator";

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
    name: "slotID",
    description: "Id of slot in which show will be shown.",
    type: "integer",
    required: true,
    example: 2,
  })
  @IsInt()
  @IsNumber()
  slotId: number;

  @ApiProperty({
    name: "date",
    description: "Date on which the movie will be shown.",
    type: Date,
    required: true,
  })
  @Transform((o) => {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    let date = new Date(o.value);
    if (date < currentDate)
      throw new BadRequestException("Date should be future date.");
    else return date;
  })
  @IsDate()
  date: Date;

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
