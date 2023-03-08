import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({ type: Boolean, description: "User logged in or not" })
  status: boolean;

  @ApiProperty({ type: String, description: "Login Response Message" })
  message: string;

  @ApiProperty({ type: String, description: "Auth token" })
  token?: string | undefined;

  constructor(status, message, token?: string | undefined) {
    this.status = status;
    this.message = message;
    this.token = token;
  }
}
