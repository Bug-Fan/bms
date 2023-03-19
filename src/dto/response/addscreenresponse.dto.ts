import { ApiProperty } from "@nestjs/swagger";

export class AddScreenResponsedto {
  @ApiProperty({ type: Boolean, description: "Screen added or not." })
  status: boolean;
  @ApiProperty({
    type: String,
    description: "Add screen response message.",
    example: "Screen added.",
  })
  message: string;

  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}
