import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Class } from 'src/classes/entities/class.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,

    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,

    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const { subjectIds, classIds, ...data } = createTeacherDto;

    let subjects: Subject[] = [];

    if (subjectIds?.length) {
      subjects = await this.subjectRepository.find({
        where: { id: In(subjectIds) },
      });

      if (subjects.length !== subjectIds.length) {
        throw new NotFoundException('One or more subjects not found');
      }
    }

    const teacher = this.teacherRepository.create({
      ...data,
      subjects,
    });

    const savedTeacher = await this.teacherRepository.save(teacher);

    // Add teacher to class.teachers (many-to-many)
    if (classIds?.length) {
      const classes = await this.classRepository.find({
        where: { id: In(classIds) },
        relations: ['teachers'],
      });

      if (classes.length !== classIds.length) {
        throw new NotFoundException('One or more classes not found');
      }

      for (const cls of classes) {
        cls.teachers = Array.isArray(cls.teachers)
          ? [...cls.teachers, savedTeacher]
          : [savedTeacher];
      }

      await this.classRepository.save(classes);
    }

    return (await this.findOne(savedTeacher.id))!;
  }

  findAll() {
    return this.teacherRepository.find({
      relations: ['subjects', 'classes'],
    });
  }

  findOne(id: number) {
    return this.teacherRepository.findOne({
      where: { id },
      relations: ['subjects', 'classes'],
    });
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['subjects', 'classes'],
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    const { subjectIds, classIds, ...otherFields } = updateTeacherDto;

    // Update subjects
    if (subjectIds) {
      const subjects = await this.subjectRepository.find({
        where: { id: In(subjectIds) },
      });

      if (subjects.length !== subjectIds.length) {
        throw new NotFoundException('One or more subjects not found');
      }

      teacher.subjects = subjects;
    }

    Object.assign(teacher, otherFields);
    const updatedTeacher = await this.teacherRepository.save(teacher);

    // Update classes.teacher relation (many-to-many)
    if (classIds) {
      const classes = await this.classRepository.find({
        where: { id: In(classIds) },
        relations: ['teachers'],
      });

      if (classes.length !== classIds.length) {
        throw new NotFoundException('One or more classes not found');
      }

      for (const cls of classes) {
        cls.teachers = Array.isArray(cls.teachers)
          ? [...new Set([...cls.teachers, updatedTeacher])]
          : [updatedTeacher];
      }

      await this.classRepository.save(classes);
    }

    return (await this.findOne(updatedTeacher.id))!;
  }

  remove(id: number) {
    return this.teacherRepository.delete(id);
  }
}
