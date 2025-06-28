import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher, Subject, Class, Attendance])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
