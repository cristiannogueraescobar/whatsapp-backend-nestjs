import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class WebhookMessageDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDateString()
  @IsOptional()
  timestamp?: string;
}