import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class SupervisorDto {
  @IsNotEmpty()
  staffNo: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  othernames: string;

  @IsNotEmpty()
  @IsPhoneNumber('KE')
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateSupervisorDto extends PartialType(SupervisorDto) {}
