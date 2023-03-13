import { ApiProperty } from "@nestjs/swagger";

export class AddShowResponse {
  @ApiProperty({ type: Boolean, description: "Show added or not." })
  status: boolean;
  @ApiProperty({
    type: String,
    description: "Add show response message.",
    example: "Show added.",
  })
  message: string;

  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}
