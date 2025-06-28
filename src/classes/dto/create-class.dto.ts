import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty({ message: 'Class name is required' })
  @Length(2, 100, { message: 'Class name must be between 2 and 100 characters' })
  name: string; // e.g. "Class 1A"

  @IsString()
  @IsNotEmpty({ message: 'Class level is required' })
  @Length(2, 50, { message: 'Class level must be between 2 and 50 characters' })
  level: string; // e.g. "JSS1" or "SSS3"
}
