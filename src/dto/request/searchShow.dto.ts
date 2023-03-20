import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
export class SearchShowDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    name: "movieName",
    description: "name of movie to search",
    required: true,
    type: "string",
  })
  movieName: string;

  @IsOptional()
  @Transform((o) => parseInt(o.value))
  @IsNumber()
  page: number;
}
