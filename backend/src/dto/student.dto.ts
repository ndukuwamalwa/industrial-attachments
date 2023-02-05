import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class StudentDto {
  @IsNotEmpty()
  registrationNo: string;

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

export class UpdateStudentDto extends PartialType(StudentDto) {}
