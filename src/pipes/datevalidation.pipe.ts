import { ArgumentMetadata, PipeTransform, ValidationPipe } from "@nestjs/common";
import * as moment from 'moment-timezone'
import { AddShowDTO } from "src/dto/request/addShow.dto";
export class DateValidationPipe implements PipeTransform{
    transform(value: AddShowDTO, metadata: ArgumentMetadata) {
        
        let date = new Date(value.startDateTime)
        let x = moment(date);
        x = new Date(x.tz("Asia/Kolkata").format('Z').toString());
        return 
        return x;
    }
    
}