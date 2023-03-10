import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class BookingRequestDto {
  @IsNotEmpty()
  @IsUUID()
  showId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Transform((o) => {
    return Array.from(new Set(o.value));
  })
  seats: number[];
}
