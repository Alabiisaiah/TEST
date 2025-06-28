import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AssessmentsModule } from './assessments/assessments.module';

import { User } from './users/entities/user.entity';
import { Student } from './students/entities/student.entity';
import { Class } from './classes/entities/class.entity';
import { Teacher } from './teachers/entities/teacher.entity';
import { Subject } from './subjects/entities/subject.entity';
import { Assessment } from './assessments/entities/assessment.entity';
import { SessionsModule } from './sessions/sessions.module';
import { Session } from './sessions/entities/session.entity';
import { AttendanceModule } from './attendance/attendance.module';
import { Attendance } from './attendance/entities/attendance.entity';
import { DashboardModule } from './dashboard/dashboard.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test_user',
      entities: [
        User,
        Student,
        Class,
        Teacher,
        Subject,
        Assessment, 
        Session,
        Attendance,
      ],
      synchronize: true,
    }),
    UsersModule,
    StudentsModule,
    ClassesModule,
    TeachersModule,
    SubjectsModule,
    AssessmentsModule,
    SessionsModule,
    AttendanceModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
