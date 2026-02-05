import { IsEmail, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateTravelerDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(6, 100)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;
}
