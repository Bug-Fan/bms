import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { DbModule } from "./db/db.module";
import { ShowsModule } from './shows/shows.module';
import { ScreenModule } from './screen/screen.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, AuthModule, ShowsModule, ScreenModule],
})
export class AppModule {}
