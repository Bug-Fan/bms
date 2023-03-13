import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserDto {
  @ApiProperty({
    type: String,
    description: "User Email.",
    example: "parth@gmail.com",
  })
  @IsEmail()
  userEmail: string;

  @ApiProperty({
    type: String,
    description: "User Password.",
    example: "Hello#123",
  })
  @IsNotEmpty()
  @MinLength(3)
  userPassword: string;

  constructor(userEmail, userPassword) {
    this.userEmail = userEmail;
    this.userPassword = userPassword;
  }
}
