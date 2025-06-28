import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      const student = await this.studentsService.create(createStudentDto);
      return {
        message: 'Student created successfully',
        data: student,
      };
    } catch (error) {
      throw new HttpException(
        'Email already exists or bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    const students = await this.studentsService.findAll();
    return {
      message: 'All students retrieved successfully',
      data: students,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const student = await this.studentsService.findOne(+id);
    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'Student retrieved successfully',
      data: student,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const updated = await this.studentsService.update(+id, updateStudentDto);
    return {
      message: 'Student updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.studentsService.remove(+id);
    return {
      message: 'Student deleted successfully',
    };
  }
}
