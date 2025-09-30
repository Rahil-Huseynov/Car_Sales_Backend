import { Injectable } from '@nestjs/common';
import { MailerService as MailService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: MailService) {}

  async sendMail(to: string, subject: string, text: string) {
    return await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }
}
