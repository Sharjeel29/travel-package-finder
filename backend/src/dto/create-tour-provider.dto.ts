import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTourProviderDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  country?: string;
}
