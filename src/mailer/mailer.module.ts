import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MailerModule } from "@nestjs-modules/mailer"
import { MailerService } from "./mailer.service"
import { MailerController } from "./mailer.controller"

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>("SMTP_HOST")!,
          port: +config.get<number>("SMTP_PORT")!,
          secure: +config.get<number>("SMTP_PORT")! === 465,
          auth: {
            user: config.get<string>("SMTP_USER")!,
            pass: config.get<string>("SMTP_PASS")!,
          },
        },
        defaults: {
          from: '"Car Sales" <noreply@carsales.az>',
        },
      }),
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailModule {}