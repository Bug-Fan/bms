import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConnection } from './database.connection';
import { LogService } from './log.service';

@Module({
  imports: [ConfigModule],
  providers: [...DbConnection, LogService],
  exports: [...DbConnection, LogService],
})
export class DbModule {}
