import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  studentId: number;

  @IsNotEmpty()
  date: string;

  @IsEnum(['present', 'absent', 'late'])
  status: 'present' | 'absent' | 'late';

  @IsString()
  @IsNotEmpty()
  term: string;

  @IsString()
  @IsNotEmpty()
  session: string;

   @IsString()
  @IsNotEmpty()
  classId: string;
}
