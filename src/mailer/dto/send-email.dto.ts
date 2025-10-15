import { IsEmail, IsString, IsOptional } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  carTitle?: string;


  @IsOptional()
  @IsString()
  sellerName:string;
  
  @IsOptional()
  @IsEmail()
  from?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}