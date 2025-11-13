import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsInt()
  @Min(0)
  currentMileage: number;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  vin?: string;
}
