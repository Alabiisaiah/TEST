import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Class } from 'src/classes/entities/class.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const { classId, ...studentData } = createStudentDto;

    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    const student = this.studentRepository.create({
      ...studentData,
      class: classEntity,
    });

    return this.studentRepository.save(student);
  }

  async findAll() {
    return this.studentRepository.find({
      relations: ['class'],
    });
  }

  async findOne(id: number) {
    return this.studentRepository.findOne({
      where: { id },
      relations: ['class'],
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['class'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Handle classId separately
    if (updateStudentDto.classId !== undefined) {
      const classEntity = await this.classRepository.findOne({
        where: { id: updateStudentDto.classId },
      });

      if (!classEntity) {
        throw new NotFoundException(`Class with ID ${updateStudentDto.classId} not found`);
      }

      student.class = classEntity;
    }

    const { classId, ...otherFields } = updateStudentDto;
    Object.assign(student, otherFields);

    return this.studentRepository.save(student);
  }

  async remove(id: number) {
    return this.studentRepository.delete(id);
  }
}
