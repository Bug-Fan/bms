import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserDto {
  @ApiProperty({
    type: String,
    example: "parth@gamil.com",
    description: "User Email",
  })
  @IsEmail()
  userEmail: string;

  @ApiProperty({
    type: String,
    example: "Hello#123",
    description: "User Password",
  })
  @IsNotEmpty()
  @MinLength(3)
  userPassword: string;

  constructor(userEmail, userPassword) {
    this.userEmail = userEmail;
    this.userPassword = userPassword;
  }
}
