import { IsNotEmpty, IsUUID } from 'class-validator';

export class CancelTicketsRequestDto {
  @IsNotEmpty()
  @IsUUID()
  bookingId: string;
}
