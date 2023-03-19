import { ApiProperty } from "@nestjs/swagger";

export class RegistrationResponseDto {
  @ApiProperty({ type: Boolean, description: "User registered or not." })
  status: boolean;

  @ApiProperty({
    type: String,
    description: "Registration response message.",
    example: "Registration successful.",
  })
  message: string;

  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}
