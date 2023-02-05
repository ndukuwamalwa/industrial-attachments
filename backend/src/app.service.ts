import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AttachmentEntity,
  LogbookEntity,
  StudentEntity,
  SupervisorEntity,
  UserEntity,
} from './entities/common.entity';
import { StudentDto, UpdateStudentDto } from './dto/student.dto';
import { SupervisorDto, UpdateSupervisorDto } from './dto/supervisor.dto';
import { AttachmentDto, UpdateAttachmentDto } from './dto/attachment.dto';
import { LogDto } from './dto/logs.dto';
import { DataSource, In } from 'typeorm';
import { Validation } from './utils/validation';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AppService {
  constructor(private datasource: DataSource) {}

  getStudents(active: number): Promise<Array<StudentEntity>> {
    return this.datasource.getRepository(StudentEntity).find({
      where: {
        active: active === 1,
      },
    });
  }

  async addStudents(
    payload: Array<StudentDto>,
    approved: number,
  ): Promise<string> {
    if (payload.length === 0) {
      throw new BadRequestException(`No data provided`);
    }
    if (payload.length > 200) {
      throw new BadRequestException(
        `You cannot upload more than 200 records at once.`,
      );
    }
    payload.forEach((s) => {
      s.registrationNo = s.registrationNo.trim().toUpperCase();
      s.phone = s.phone.trim();
      if (!Validation.isKePhoneNo(s.phone)) {
        throw new BadRequestException(`Invalid phone number ${s.phone}`);
      }
      s.phone = Validation.formatKePhone(s.phone);
      s.email = s.email.toLowerCase();
    });
    const processedRegNos = [];
    payload.forEach((s) => {
      if (processedRegNos.includes(s.registrationNo.toUpperCase())) {
        throw new BadRequestException(
          `Registration No. ${s.registrationNo.toUpperCase()} appears more than once in the data.`,
        );
      }
      processedRegNos.push(s.registrationNo.toUpperCase());
    });
    const processedPhones = [];
    payload.forEach((s) => {
      if (processedPhones.includes(s.phone)) {
        throw new BadRequestException(
          `Phone No. ${s.phone} appears more than once in the data`,
        );
      }
      processedPhones.push(s.phone);
    });
    const processedEmails = [];
    payload.forEach((s) => {
      if (processedEmails.includes(s.email)) {
        throw new BadRequestException(
          `Email address ${s.email} appears more than once in the data`,
        );
      }
      processedEmails.push(s.email);
    });
    const errors: Array<{ key: string; reason: string }> = [];
    return this.datasource.transaction(async (t) => {
      for (const rec of payload) {
        const existByReg = await t.getRepository(StudentEntity).findOne({
          where: {
            registrationNo: rec.registrationNo,
          },
        });
        if (existByReg) {
          errors.push({
            key: rec.registrationNo,
            reason: `Already exists in the database.`,
          });
          continue;
        }
        const existsByPhone = await t.getRepository(StudentEntity).findOne({
          where: {
            phone: rec.phone,
          },
        });
        if (existsByPhone) {
          errors.push({
            key: rec.phone,
            reason: `Already used by another student.`,
          });
          continue;
        }

        const existsByEmail = await t.getRepository(StudentEntity).findOne({
          where: {
            email: rec.email,
          },
        });
        if (existsByEmail) {
          errors.push({
            key: rec.phone,
            reason: `Already used by another student`,
          });
          continue;
        }
        const entity: StudentEntity = {
          ...rec,
          id: null,
          dateCreated: Validation.currentTimestamp(),
          active: true,
          approved: approved === 1,
        };
        const ins = await t.getRepository(StudentEntity).insert(entity);
        const user: UserEntity = {
          id: null,
          type: 'Student',
          typeID: ins.raw.insertId,
          username: rec.registrationNo,
          password: Validation.encryptPassword(rec.phone),
          tempPassword: Validation.encryptPassword(rec.phone),
          reset: true,
          dateCreated: Validation.currentTimestamp(),
        };
        await t.getRepository(UserEntity).insert(user);
      }
      if (errors.length > 0) {
        return JSON.stringify(errors);
      }
      return 'OK';
    });
  }

  async editStudent(id: number, student: UpdateStudentDto): Promise<string> {
    const rec = await this.datasource.getRepository(StudentEntity).findOne({
      where: {
        id,
      },
    });
    if (!rec) {
      throw new BadRequestException(`Record not found`);
    }
    await this.datasource.getRepository(StudentEntity).update(
      {
        id,
      },
      student,
    );
    return 'OK';
  }

  async deleteStudents(ids: Array<number>): Promise<string> {
    try {
      await this.datasource.getRepository(StudentEntity).delete({
        id: In(ids),
      });
      return 'OK';
    } catch (err) {
      throw new ConflictException(
        `Failed to delete, record dependencies found`,
      );
    }
  }

  getSupervisors(active: number): Promise<Array<SupervisorEntity>> {
    return this.datasource.getRepository(SupervisorEntity).find({
      where: {
        active: active === 1,
      },
    });
  }

  async addSupervisors(payload: Array<SupervisorDto>): Promise<string> {
    if (payload.length === 0) {
      throw new BadRequestException(`No data provided`);
    }
    if (payload.length > 200) {
      throw new BadRequestException(
        `You cannot upload more than 200 records at once.`,
      );
    }
    payload.forEach((s) => {
      s.staffNo = s.staffNo.trim().toUpperCase();
      s.phone = s.phone.trim();
      if (!Validation.isKePhoneNo(s.phone)) {
        throw new BadRequestException(`Invalid phone number: ${s.phone}`);
      }
      s.phone = Validation.formatKePhone(s.phone);
      s.email = s.email.toLowerCase();
    });
    const processedStaffNos = [];
    payload.forEach((s) => {
      if (processedStaffNos.includes(s.staffNo.toUpperCase())) {
        throw new BadRequestException(
          `Staff No. ${s.staffNo.toUpperCase()} appears more than once in the data.`,
        );
      }
      processedStaffNos.push(s.staffNo);
    });
    const processedPhones = [];
    payload.forEach((s) => {
      if (processedPhones.includes(s.phone)) {
        throw new BadRequestException(
          `Phone No. ${s.phone} appears more than once in the list`,
        );
      }
      processedPhones.push(s.phone);
    });
    const processedEmails = [];
    payload.forEach((s) => {
      if (processedEmails.includes(s.email)) {
        throw new BadRequestException(
          `Email address ${s.email} appears more than once in the data`,
        );
      }
      processedEmails.push(s.email);
    });
    const errors: Array<{ key: string; reason: string }> = [];
    return this.datasource.transaction(async (t) => {
      for (const rec of payload) {
        const existByStaffNo = await t.getRepository(SupervisorEntity).findOne({
          where: {
            staffNo: rec.staffNo,
          },
        });
        if (existByStaffNo) {
          errors.push({
            key: rec.staffNo,
            reason: `Already exists in the database.`,
          });
          continue;
        }
        const existsByPhone = await t.getRepository(SupervisorEntity).findOne({
          where: {
            phone: rec.phone,
          },
        });
        if (existsByPhone) {
          errors.push({
            key: rec.phone,
            reason: `Already used by another staff member.`,
          });
          continue;
        }

        const existsByEmail = await t.getRepository(SupervisorEntity).findOne({
          where: {
            email: rec.email,
          },
        });
        if (existsByEmail) {
          errors.push({
            key: rec.phone,
            reason: `Already used by another staff member`,
          });
          continue;
        }
        const ins = await t.getRepository(SupervisorEntity).insert({
          ...rec,
          id: null,
          dateCreated: Validation.currentTimestamp(),
          active: true,
        });
        const user: UserEntity = {
          id: null,
          type: 'Supervisor',
          typeID: ins.raw.insertId,
          username: rec.email,
          password: Validation.encryptPassword(rec.staffNo),
          tempPassword: Validation.encryptPassword(rec.phone),
          reset: true,
          dateCreated: Validation.currentTimestamp(),
        };
        await t.getRepository(UserEntity).insert(user);
      }
      if (errors.length > 0) {
        return JSON.stringify(errors);
      }
      return 'OK';
    });
  }

  async editSupervisors(
    id: number,
    supervisor: UpdateSupervisorDto,
  ): Promise<string> {
    const repo = this.datasource.getRepository(SupervisorEntity);
    const rec = await repo.findOne({
      where: {
        id,
      },
    });
    if (!rec) {
      throw new BadRequestException(`Record to update not found.`);
    }
    await repo.update({ id }, supervisor);
    return 'OK';
  }

  async deleteSupervisors(ids: Array<number>): Promise<string> {
    try {
      await this.datasource.getRepository(SupervisorEntity).delete({
        id: In(ids),
      });
      return 'OK';
    } catch (err) {
      throw new ConflictException(`Cannot delete a record with dependencies`);
    }
  }

  async getAttachments(status: string): Promise<Array<any>> {
    return this.datasource.query(
      `
    SELECT attachments.*, CONCAT(students.firstname, ' ', students.lastname) studentName,
    students.registrationNo, (SELECT CONCAT(supervisors.firstname, ' ', supervisors.lastname) 
     FROM supervisors WHERE supervisors.id=attachments.supervisor) supervisor
    FROM attachments, students
    WHERE attachments.student = students.id AND attachments.status=?`,
      [status],
    );
  }

  async addAttachment(
    student: number,
    attachment: AttachmentDto,
  ): Promise<string> {
    const repo = this.datasource.getRepository(AttachmentEntity);
    const exist = await repo.findOne({
      where: {
        student,
        status: In([
          'NOT-ASSIGNED',
          'ON-GOING',
          'NOT GRADED',
          'AWAITING GRADING',
        ]),
      },
    });
    if (exist) {
      throw new BadRequestException(
        `There is an attachment that has not been marked as completed`,
      );
    }
    const entity: AttachmentEntity = {
      ...attachment,
      id: null,
      student,
      supervisor: null,
      status: 'NOT-ASSIGNED',
      score: null,
      grade: null,
      dateCreated: Validation.currentTimestamp(),
      dateUpdate: Validation.currentTimestamp(),
      updatedBy: null,
    };
    await repo.insert(entity);
    return 'OK';
  }

  async editAttachments(
    id: number,
    attachment: UpdateAttachmentDto,
  ): Promise<string> {
    const repo = this.datasource.getRepository(AttachmentEntity);
    const rec = await repo.findOne({
      where: {
        id,
      },
    });
    if (!rec) {
      throw new BadRequestException(`Record not found`);
    }
    Object.keys(attachment).forEach((k) => {
      if (!attachment[k]) {
        delete attachment[k];
      }
    });
    if (attachment.supervisor && rec.supervisor !== attachment.supervisor) {
      if (!rec.supervisor) {
        rec.status = 'ON-GOING';
      }
      rec.supervisor = attachment.supervisor;
    }
    if (attachment.studentDone) {
      rec.status = 'AWAITING GRADING';
    }
    if (attachment.score && attachment.grade) {
      rec.status = 'COMPLETED';
      rec.grade = attachment.grade;
      rec.score = attachment.score;
    }
    await repo.update({ id: rec.id }, rec);
    return 'OK';
  }

  async deleteAttachments(ids: Array<number>): Promise<string> {
    try {
      const del = await this.datasource.getRepository(AttachmentEntity).delete({
        id: In(ids),
        status: In(['NOT-ASSIGNED', 'CANCELLED']),
      });
      return `${del.affected} Record(s) affected`;
    } catch (err) {
      throw new BadRequestException(`Unknown error.`);
    }
  }

  getLogs(attachment: number): Promise<Array<LogbookEntity>> {
    return this.datasource.query(`SELECT * FROM logbook WHERE attachment=?`, [
      attachment,
    ]);
  }

  async addLog(attachment: number, log: LogDto): Promise<string> {
    const logbook: LogbookEntity = {
      ...log,
      id: null,
      attachment,
      dateCreated: Validation.currentTimestamp(),
    };
    await this.datasource.getRepository(LogbookEntity).insert(logbook);
    return 'OK';
  }

  async editLog(id: number, log: LogDto): Promise<string> {
    await this.datasource.getRepository(LogbookEntity).update({ id }, log);
    return 'OK';
  }

  async deleteLog(id: number): Promise<string> {
    await this.datasource.getRepository(LogbookEntity).delete({ id });
    return 'OK';
  }

  async login(login: LoginDto) {
    const user = await this.datasource.getRepository(UserEntity).findOne({
      where: {
        username: login.username,
      },
    });
    const error = new UnauthorizedException(`Invalid username/password`);
    if (!user) {
      throw error;
    }
    if (
      user.reset &&
      !Validation.isCorrectPassword(login.password, user.tempPassword)
    ) {
      throw error;
    }
    if (user.reset) {
      return 'Reset';
    }
    if (!Validation.isCorrectPassword(login.password, user.password)) {
      throw error;
    }
    return {
      id: user.id,
      username: user.username,
      type: user.type,
      typeID: user.typeID,
    };
  }

  async passwordReset(payload: LoginDto) {
    const repo = this.datasource.getRepository(UserEntity);
    const user = await repo.findOne({
      where: {
        username: payload.username,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid request');
    }
    await repo.update(
      { id: user.id },
      { reset: false, password: Validation.encryptPassword(payload.password) },
    );
    return this.login(payload);
  }
}
