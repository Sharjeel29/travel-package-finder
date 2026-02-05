import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateTravelerDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Length(6, 100)
  password?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;
}
