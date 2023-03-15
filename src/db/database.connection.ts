import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Log } from './entities/log.entity';
import { Movie } from './entities/movie.entity';
import { Refund } from './entities/refund.entity';
import { Screen } from './entities/screen.entity';
import { Show } from './entities/show.entity';
import { User } from './entities/user.entity';

export const DbConnection = [
  {
    provide: 'DataSource',
    useFactory: async (configService: ConfigService) => {
      const datasource = new DataSource({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [User, Log, Booking, Movie, Screen, Show, Refund],
        logging: true,
      });
      return await datasource.initialize();
    },
    inject: [ConfigService],
  },
];
