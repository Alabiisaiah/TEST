import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Subject } from 'src/subjects/entities/subject.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  // ✅ 1. General summary of total counts
  async getSummary() {
    const [students, teachers, subjects, classes] = await Promise.all([
      this.studentRepository.count(),
      this.teacherRepository.count(),
      this.subjectRepository.count(),
      this.classRepository.count(),
    ]);

    return {
      totalStudents: students,
      totalTeachers: teachers,
      totalSubjects: subjects,
      totalClasses: classes,
    };
  }

  // ✅ 2. Attendance summary by TERM for a specific class
  async getClassAttendanceSummaryByTerm(
    classId: string,
    term: string,
    session: string,
  ) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });

    const totalStudents = await this.studentRepository.count({
      where: { class: { id: classId } },
    });

    const attendances = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoin('student.class', 'class')
      .where('class.id = :classId', { classId })
      .andWhere('attendance.term = :term', { term })
      .andWhere('attendance.session = :session', { session })
      .getMany();

    const present = attendances.filter((r) => r.status === 'present').length;
    const absent = attendances.filter((r) => r.status === 'absent').length;

    return {
      classId,
      className: classEntity?.name || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      term,
      totalStudents,
      present,
      absent,
    };
  }

  // ✅ 3. Attendance summary by DAY for a specific class
  async getClassAttendanceSummaryByDay(classId: number, dateStr: string) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const attendances = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.class', 'class')
      .where('class.id = :classId', { classId })
      .andWhere('attendance.date >= :date AND attendance.date < :nextDay', {
        date,
        nextDay,
      })
      .getMany();

    return {
      classId,
      date: date.toISOString().split('T')[0],
      total: attendances.length,
      present: attendances.filter((r) => r.status === 'present').length,
      absent: attendances.filter((r) => r.status === 'absent').length,
    };
  }

  // ✅ 4. Attendance summary for ALL classes today
  async getTodaysAttendanceByClass() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const attendances = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.class', 'class')
      .where('attendance.date >= :today AND attendance.date < :tomorrow', {
        today,
        tomorrow,
      })
      .getMany();

    const attendanceMap = new Map<string, Attendance[]>();

    for (const attendance of attendances) {
      const className = attendance.student.class?.name || 'Unknown';

      if (!attendanceMap.has(className)) {
        attendanceMap.set(className, []);
      }
      attendanceMap.get(className)!.push(attendance);
    }

    const result: {
      className: string;
      total: number;
      present: number;
      absent: number;
    }[] = [];

    for (const [className, records] of attendanceMap.entries()) {
      result.push({
        className,
        total: records.length,
        present: records.filter((r) => r.status === 'present').length,
        absent: records.filter((r) => r.status === 'absent').length,
      });
    }

    return result;
  }
}
