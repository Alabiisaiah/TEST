import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Assessment } from 'src/assessments/entities/assessment.entity';
import { OneToMany } from 'typeorm';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @ManyToMany(() => Class, (cls) => cls.teachers, { cascade: true })
  @JoinTable()
  classes: Class[];

  @ManyToMany(() => Subject, (subject) => subject.teachers, { cascade: true })
  @JoinTable()
  subjects: Subject[];

  @OneToMany(() => Assessment, (assessment) => assessment.teacher)
assessments: Assessment[];


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
