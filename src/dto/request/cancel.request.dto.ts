import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CancelRequestDto {
  @ApiProperty({
    name: "bookingId",
    description: "Id of booking to be canceled.",
    type: "string",
    required: true,
    example: "d3cbb59b-998d-48a1-9e25-6f45364fc486",
  })
  @IsNotEmpty()
  @IsUUID()
  bookingId: string;
}
