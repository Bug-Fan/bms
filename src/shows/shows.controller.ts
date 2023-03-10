import { Controller, Get, Post } from '@nestjs/common';
import { Body, Query, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from 'src/db/user.role';
import { AddShowDTO } from 'src/dto/request/addShow.dto';
import { SearchShowDTO } from 'src/dto/request/searchShow.dto';
import { AddShowResponse } from 'src/dto/response/addShowResponse.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { ShowsService } from './shows.service';


@Controller('shows')
export class ShowsController {

  constructor(
    private showService: ShowsService
  ) { }

  @UseGuards(AuthGuard('jwt'),new RoleGuard(UserRoles.admin))
  @Post()
  addShow(@Body() show: AddShowDTO): Promise<AddShowResponse> {
    return this.showService.addShow(show);
  }

  @Get('get')
  getShows(@Query() movieDTO:SearchShowDTO) {
    return this.showService.getShows(movieDTO)
  }

}
