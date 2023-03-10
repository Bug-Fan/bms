import { IsNotEmpty, IsUUID } from 'class-validator';

export class CancelRequestDto {
  @IsNotEmpty()
  @IsUUID()
  bookingId: string;
}
