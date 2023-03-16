import { Controller, Get, Post } from '@nestjs/common';
import { Body, Delete, Param, Query, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from 'src/db/user.role';
import { AddShowDTO } from 'src/dto/request/addShow.dto';
import { SearchShowDTO } from 'src/dto/request/searchShow.dto';
import { AddShowResponse } from 'src/dto/response/addShowResponse.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { ShowsService } from './shows.service';
import { DateValidate } from '../pipes/dateValidation.pipe'
import { CancelShowDto } from 'src/dto/request/cancel.show.dto';
import { AvailableSeatDto } from 'src/dto/request/availableseat.dto';

@Controller("shows")
export class ShowsController {
  constructor(private showService: ShowsService) {}

  @UseGuards(AuthGuard("jwt"), new RoleGuard(UserRoles.admin))
  @UsePipes(new DateValidate())
  @Post('add')
  addShow(@Body() show: AddShowDTO): Promise<AddShowResponse> {
    return this.showService.addShow(show);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(UserRoles.admin))
  @Delete("cancel")
  cancelShow(@Query() cancelShowDto: CancelShowDto) {
    return this.showService.cancelShow(cancelShowDto);
  }

  @Get("getShow")
  getShows(@Query() movieDTO: SearchShowDTO) {
    return this.showService.getShows(movieDTO);
  }
  
  @Get("getSeats")
  getShowsSeats(@Query() movieDTO: AvailableSeatDto) {
    return this.showService.getAvailableSeats(movieDTO);
  }
}
