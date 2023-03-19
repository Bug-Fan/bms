import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CancelShowDto {
  @ApiProperty({
    name: "showId",
    description: "Id of show to be canceled.",
    type: "string",
    required: true,
    example: "d3cbb59b-998d-48a1-9e25-6f45364fc486",
  })
  @IsUUID()
  showId: string;
}