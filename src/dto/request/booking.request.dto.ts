import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class BookingRequestDto {
  @ApiProperty({
    name:'showId',
    description:'Id of show to be booked',
    type:'uuid',
    required:true
  })
  @IsNotEmpty()
  @IsUUID()
  showId: string;

  @ApiProperty({
    name:'seats',
    description:'Array of seats to be booked',
    type:'array',
    required:true
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ArrayUnique()
  seats: number[];
}
