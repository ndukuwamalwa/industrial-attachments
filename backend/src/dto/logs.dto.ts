import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class LogDto {
  @IsNotEmpty()
  @IsDate()
  logDate: string;

  @IsNotEmpty()
  @IsString()
  log: string;
}