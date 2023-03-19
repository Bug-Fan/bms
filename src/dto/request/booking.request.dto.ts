import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from "class-validator";

export class BookingRequestDto {
  @ApiProperty({
    name: "showId",
    description: "Id of show to be booked.",
    type: "string",
    required: true,
    example: "d3cbb59b-998d-48a1-9e25-6f45364fc486",
  })
  @IsNotEmpty()
  @IsUUID()
  showId: string;

  @ApiProperty({
    name: "seats",
    description: "Array of seats to be booked.",
    type: "number",
    required: true,
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ArrayUnique()
  seats: number[];
}
