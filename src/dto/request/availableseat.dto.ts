import { IsNotEmpty, IsUUID } from "class-validator";

export class AvailableSeatDto{

    @IsUUID()
    showId:string
}