import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class AddScreenDTO {

  @ApiProperty({
    name:'screenName',
    description:'name of screen',
    type:'string',
    required:true
  })
  @IsNotEmpty()
  screenName: string;

  @ApiProperty({
    name:'maxCapacity',
    description:'max capacity of screen',
    type:'integer',
    required:true
  })
  @IsInt()
  maxCapacity: number;
}