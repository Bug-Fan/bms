import { ApiProperty } from "@nestjs/swagger";

export class CancelResponseDto {
  @ApiProperty({ type: Boolean, description: "Booking canceled or not." })
  status: boolean;

  @ApiProperty({
    type: String,
    description: "Cancel response message.",
    example: "Booking canceled.",
  })
  message: string;

  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}
