import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.assessments, { eager: true, onDelete: 'CASCADE' })
  student: Student;

  @ManyToOne(() => Subject, (subject) => subject.assessments, { eager: true, onDelete: 'CASCADE' })
  subject: Subject;

  @ManyToOne(() => Teacher, (teacher) => teacher.assessments, { eager: true, onDelete: 'CASCADE' })
  teacher: Teacher;

  @Column('float')
  score: number;

  @Column({ type: 'enum', enum: ['First', 'Second', 'Third'] })
  term: 'First' | 'Second' | 'Third';

  @Column({ type: 'varchar', length: 9 })
  session: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
