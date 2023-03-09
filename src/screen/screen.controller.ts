import { Controller, Post } from '@nestjs/common';
import { AddScreenDTO } from 'src/dto/request/addscreen.dto';
import { ScreenService } from './screen.service';

@Controller('screen')
export class ScreenController {

  constructor(
    private screenService: ScreenService
  ) { }

  
  @Post('add')
  addScreen(addScreenDTo:AddScreenDTO){
    return this.screenService.addScreen(addScreenDTo);
  }
}
