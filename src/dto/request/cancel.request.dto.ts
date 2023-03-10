import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CancelRequestDto {
  @ApiProperty({
    name:'bookingId',
    description:'Id of booking to be canceled',
    type:'uuid',
    required:true
  })
  @IsNotEmpty()
  @IsUUID()
  bookingId: string;
}
