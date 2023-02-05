import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class AttachmentDto {
  @IsNotEmpty()
  company: string;

  @IsNotEmpty()
  @IsDate()
  startDate: string;

  @IsNotEmpty()
  @IsDate()
  endDate: string;

  @IsNotEmpty()
  industrySupervisor: string;

  @IsNotEmpty()
  industrySupervisorContact: string;
}

export class UpdateAttachmentDto extends PartialType(AttachmentDto) {
  @IsNotEmpty()
  @IsNumber()
  supervisor: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsOptional()
  grade: string;

  @IsOptional()
  @IsBoolean()
  studentDone: boolean;
}
