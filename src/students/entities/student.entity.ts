import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Class } from '../../classes/entities/class.entity';
import { Assessment } from 'src/assessments/entities/assessment.entity';
import { OneToMany } from 'typeorm';
import { Attendance } from 'src/attendance/entities/attendance.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @ManyToOne(() => Class, (classEntity) => classEntity.students, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  class: Class;

  @OneToMany(() => Assessment, (assessment) => assessment.student)
assessments: Assessment[];

@OneToMany(() => Attendance, (attendance) => attendance.student)
attendances: Attendance[];

}
