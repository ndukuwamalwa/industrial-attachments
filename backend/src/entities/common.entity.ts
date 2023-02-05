import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  registrationNo: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  othernames: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column('timestamp')
  dateCreated: string;

  @Column()
  active: boolean;

  @Column()
  approved: boolean;
}

@Entity('supervisors')
export class SupervisorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  staffNo: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  othernames: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column('timestamp')
  dateCreated: string;

  @Column()
  active: boolean;
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['Admin', 'Student', 'Supervisor'] })
  type: 'Admin' | 'Student' | 'Supervisor';

  @Column()
  typeID: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  tempPassword: string;

  @Column()
  reset: boolean;

  @Column('timestamp')
  dateCreated: string;
}

@Entity('attachments')
export class AttachmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => StudentEntity, (t) => t.id, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'student' })
  student: number;

  @Column({ nullable: true })
  @ManyToOne(() => SupervisorEntity, (t) => t.id, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'supervisor' })
  supervisor: number;

  @Column()
  @Index()
  company: string;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @Column()
  industrySupervisor: string;

  @Column()
  industrySupervisorContact: string;

  @Column()
  status:
    | 'NOT-ASSIGNED'
    | 'ON-GOING'
    | 'CANCELLED'
    | 'NOT GRADED'
    | 'AWAITING GRADING'
    | 'COMPLETED';

  @Column({ type: 'double', nullable: true })
  score: number;

  @Column({ nullable: true })
  grade: string;

  @Column('timestamp')
  dateCreated: string;

  @Column('timestamp')
  dateUpdate: string;

  @Column()
  updatedBy: number;
}

@Entity('logbook')
export class LogbookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => AttachmentEntity, (t) => t.id, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'attachment' })
  attachment: number;

  @Column('date')
  logDate: string;

  @Column('text')
  log: string;

  @Column('timestamp')
  dateCreated: string;
}
