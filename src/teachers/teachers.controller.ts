import {
  Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  async create(@Body() dto: CreateTeacherDto) {
    const teacher = await this.teachersService.create(dto);
    return { message: 'Teacher created successfully', data: teacher };
  }

  @Get()
  async findAll() {
    const data = await this.teachersService.findAll();
    return { message: 'All teachers retrieved', data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const teacher = await this.teachersService.findOne(+id);
    return { message: 'Teacher retrieved', data: teacher };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    const updated = await this.teachersService.update(+id, dto);
    return { message: 'Teacher updated', data: updated };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.teachersService.remove(+id);
    return { message: 'Teacher deleted' };
  }
}
