import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { StudentDto, UpdateStudentDto } from './dto/student.dto';
import { IDListDto } from './dto/common.dto';
import { SupervisorDto, UpdateSupervisorDto } from './dto/supervisor.dto';
import { AttachmentDto, UpdateAttachmentDto } from './dto/attachment.dto';
import { LogDto } from './dto/logs.dto';
import { LoginDto } from "./dto/login.dto";

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  login(@Body() login: LoginDto) {
    return this.appService.login(login);
  }

  @Post('password-reset')
  passwordReset(@Body() login: LoginDto) {
    return this.appService.passwordReset(login);
  }

  @Get('students/:active')
  getStudents(@Param('active') active: number) {
    return this.appService.getStudents(active);
  }

  @Post('students/:approve')
  addStudents(@Body() students: Array<StudentDto>, @Param('approve') approve: number) {
    return this.appService.addStudents(students, approve);
  }

  @Put('students/:id')
  editStudents(@Param('id') id: number, @Body() student: UpdateStudentDto) {
    return this.appService.editStudent(id, student);
  }

  @Delete('students')
  deactivateStudents(@Query() query: IDListDto) {
    return this.appService.deleteStudents(query.ids);
  }

  @Get('supervisors/:active')
  getSupervisors(@Param('active') active: number) {
    return this.appService.getSupervisors(active);
  }

  @Post('supervisors')
  addSupervisors(@Body() supervisors: Array<SupervisorDto>) {
    return this.appService.addSupervisors(supervisors);
  }

  @Put('supervisors/:id')
  editSupervisors(
    @Param('id') id: number,
    @Body() supervisor: UpdateSupervisorDto,
  ) {
    return this.appService.editSupervisors(id, supervisor);
  }

  @Delete('supervisors')
  deactivateSupervisors(@Query() query: IDListDto) {
    return this.appService.deleteSupervisors(query.ids);
  }

  @Get('attachments/:status')
  getAttachments(@Param('status') status: string, @Query() filter) {
    return this.appService.getAttachments(status);
  }

  @Post('attachments/:student')
  addAttachment(
    @Param('student') student: number,
    @Body() attachment: AttachmentDto,
  ) {
    return this.appService.addAttachment(student, attachment);
  }

  @Put('attachments/:id')
  editAttachments(
    @Param('id') id: number,
    @Body() attachment: UpdateAttachmentDto,
  ) {
    return this.appService.editAttachments(id, attachment);
  }

  @Delete('attachments')
  deactivateAttachments(@Query() query: IDListDto) {
    return this.appService.deleteAttachments(query.ids);
  }

  @Get('logs/:attachment')
  getLogs(@Param('attachment') attachment: number) {
    return this.appService.getLogs(attachment);
  }

  @Post('logs/:attachment')
  addLog(@Param('attachment') attachment: number, @Body() log: LogDto) {
    return this.appService.addLog(attachment, log);
  }

  @Put('logs/:id')
  editLog(@Param('id') id: number, @Body() log: LogDto) {
    return this.appService.editLog(id, log);
  }

  @Delete('logs/:id')
  deleteLog(@Param('id') id: number) {
    return this.appService.deleteLog(id);
  }
}
