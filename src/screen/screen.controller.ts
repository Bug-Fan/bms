import { Body, Controller, Post,UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from 'src/db/user.role';
import { AddScreenDTO } from 'src/dto/request/addscreen.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { ScreenService } from './screen.service';

@Controller('screen')
export class ScreenController {

  constructor(
    private screenService: ScreenService
  ) { }

  @UseGuards(AuthGuard('jwt'),new RoleGuard(UserRoles.admin))
  @Post('add')
  addScreen(@Body() addScreenDTo:AddScreenDTO){
    return this.screenService.addScreen(addScreenDTo);
  }
}
