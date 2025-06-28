import {
  IsInt,
  IsPositive,
  Min,
  Max,
  IsEnum,
  IsString,
  Length,
} from 'class-validator';

enum Term {
  FIRST = 'First',
  SECOND = 'Second',
  THIRD = 'Third',
}

export class CreateAssessmentDto {
  @IsInt()
  @IsPositive()
  studentId: number;

  @IsInt()
  @IsPositive()
  subjectId: number;

  @IsInt()
  @IsPositive()
  teacherId: number;

  @IsInt()
  @Min(0)
  @Max(100)
  score: number;

  @IsEnum(Term, {
    message: 'term must be either First, Second, or Third',
  })
  term: Term;

  @IsString()
  @Length(4, 9, { message: 'session should be like 2024/2025' })
  session: string;
}
