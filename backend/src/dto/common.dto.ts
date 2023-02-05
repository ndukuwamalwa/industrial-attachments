import { IsArray, IsNotEmpty } from "class-validator";

export class IDListDto {
  @IsNotEmpty()
  @IsArray()
  ids: Array<number>;
}