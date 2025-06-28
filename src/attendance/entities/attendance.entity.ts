import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Class } from 'src/classes/entities/class.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.attendances)
  student: Student;

  @ManyToOne(() => Class, (classEntity) => classEntity.attendance, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @Column({ type: 'date' })
  date: string;

  @Column({
    type: 'enum',
    enum: ['present', 'absent', 'late'],
    default: 'absent',
  })
  status: 'present' | 'absent' | 'late';

  @Column({ type: 'varchar', length: 50 })
  term: string;

  @Column({ type: 'varchar', length: 20 })
  session: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}