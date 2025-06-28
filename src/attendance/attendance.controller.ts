import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async create(@Body() createDto: CreateAttendanceDto) {
    return await this.attendanceService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.attendanceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const attendance = await this.attendanceService.findOne(+id);
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAttendanceDto,
  ) {
    const updated = await this.attendanceService.update(+id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.attendanceService.remove(+id);
    return { message: `Attendance #${id} deleted successfully` };
  }
}
