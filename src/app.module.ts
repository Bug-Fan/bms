import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { DbModule } from "./db/db.module";
import { BookingModule } from "./booking/booking.module";
import { ShowsModule } from "./shows/shows.module";
import { ScreenModule } from "./screen/screen.module";
import { EmailModule } from './email/email.module';
import { MailerModule, MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    ShowsModule,
    ScreenModule,
    BookingModule,
    EmailModule,
  ],
})
export class AppModule {}
