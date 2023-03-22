import { IsUUID } from "class-validator";

export class PayRequestDto {
  @IsUUID()
  bookingId: string;
}