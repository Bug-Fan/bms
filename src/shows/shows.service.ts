import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ShowsService {
  constructor(
    @Inject('DataSource') private dataSource: DataSource
  ) { }

  async addShow() {

  }

  async getShows() {

  }

  async getShowById() { }

}
