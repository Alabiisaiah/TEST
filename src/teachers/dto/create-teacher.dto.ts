import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  gender: string;

  @IsString()
  phone: string;

  @IsArray()
  @IsOptional()
  @ArrayUnique()
  subjectIds?: number[];

  @IsArray()
  @IsOptional()
  @ArrayUnique()
  classIds?: number[];
}
