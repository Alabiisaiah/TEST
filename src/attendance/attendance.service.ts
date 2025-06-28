import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Student } from 'src/students/entities/student.entity';
import { Class } from 'src/classes/entities/class.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createDto: CreateAttendanceDto): Promise<Attendance> {
    const { studentId, date, status, term, session, classId } = createDto;

    const student = await this.studentRepository.findOneBy({ id: studentId });
    if (!student) throw new NotFoundException(`Student with ID ${studentId} not found`);

    const classEntity = await this.classRepository.findOneBy({ id: Number(classId) });
    if (!classEntity) throw new NotFoundException(`Class with ID ${classId} not found`);

    const attendance = this.attendanceRepository.create({
      student,
      class: classEntity, // Map classId to the class entity
      date,
      status,
      term,
      session,
    });

    return this.attendanceRepository.save(attendance) as Promise<Attendance>;
  }

  findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({ relations: ['student'] });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['student'],
    });
    if (!attendance) throw new NotFoundException(`Attendance with ID ${id} not found`);
    return attendance;
  }

  async update(id: number, updateDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.attendanceRepository.preload({
      id,
      ...updateDto,
    });

    if (!attendance) throw new NotFoundException(`Attendance with ID ${id} not found`);

    return this.attendanceRepository.save(attendance);
  }

  async remove(id: number): Promise<void> {
    const result = await this.attendanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
  }
}
