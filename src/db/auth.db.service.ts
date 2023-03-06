import {
  BadGatewayException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserDto } from 'src/dto/request/user.dto';
import { DataSource, InsertResult } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AuthDbService {
  constructor(@Inject('DataSource') private dataSource: DataSource) {}

  async registerUser(registerUserDto: UserDto): Promise<InsertResult> {
    try {
      const added = await this.dataSource.manager.insert(User, registerUserDto);
      return added;
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('You are already registered! Please login');
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to register you');
      }
    }
  }

  async loginUser(userEmail): Promise<User> {
    try {
      const user = await this.dataSource.manager.findOneBy(User, { userEmail });
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
