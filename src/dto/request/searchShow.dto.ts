import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class SearchShowDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: "movieName",
    description: "Name of movie to search.",
    required: true,
    type: "string",
    example: "Fan",
  })
  movieName: string;
}
