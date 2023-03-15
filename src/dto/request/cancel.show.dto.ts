import { IsUUID } from "class-validator";

export class CancelShowDto {
  @IsUUID()
  showId: string;
}