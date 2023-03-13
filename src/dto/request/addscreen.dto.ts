import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class AddScreenDTO {
  @ApiProperty({
    name: "screenName",
    description: "Name of screen.",
    type: "string",
    required: true,
    example: "Shivaji",
  })
  @IsNotEmpty()
  screenName: string;

  @ApiProperty({
    name: "maxCapacity",
    description: "Maximum capacity of screen.",
    type: "integer",
    required: true,
    example: 150,
  })
  @IsInt()
  maxCapacity: number;
}
