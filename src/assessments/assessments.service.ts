import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Assessment } from './entities/assessment.entity';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { Student } from 'src/students/entities/student.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,

    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,

    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  async create(createAssessmentDto: CreateAssessmentDto): Promise<Assessment> {
    const { studentId, subjectId, teacherId, score, term, session } = createAssessmentDto;

    const student = await this.studentsRepository.findOneBy({ id: studentId });
    if (!student) throw new NotFoundException(`Student with ID ${studentId} not found`);

    const subject = await this.subjectsRepository.findOneBy({ id: subjectId });
    if (!subject) throw new NotFoundException(`Subject with ID ${subjectId} not found`);

    const teacher = await this.teachersRepository.findOneBy({ id: teacherId });
    if (!teacher) throw new NotFoundException(`Teacher with ID ${teacherId} not found`);

    const assessment = this.assessmentRepository.create({
      student,
      subject,
      teacher,
      score,
      term,
      session,
    });

    return this.assessmentRepository.save(assessment);
  }

  findAll(): Promise<Assessment[]> {
    return this.assessmentRepository.find({
      relations: ['student', 'subject', 'teacher'],
    });
  }

  async findOne(id: number): Promise<Assessment> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: ['student', 'subject', 'teacher'],
    });
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }
    return assessment;
  }

  async update(id: number, updateAssessmentDto: UpdateAssessmentDto): Promise<Assessment> {
    const assessment = await this.assessmentRepository.preload({
      id,
      ...updateAssessmentDto,
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }

    return this.assessmentRepository.save(assessment);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.assessmentRepository.delete(id);
  }
}
