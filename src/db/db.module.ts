import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthDbService } from "./auth.db.service";
import { DbConnection } from "./database.connection";
import { LogService } from "./log.service";

@Module({
  imports: [ConfigModule],
  providers: [...DbConnection, LogService, AuthDbService],
  exports: [...DbConnection, LogService, AuthDbService],
})
export class DbModule {}
