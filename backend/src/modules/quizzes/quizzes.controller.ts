import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { Role } from '@prisma/client';

@ApiTags('quizzes')
@Controller('quizzes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  // ==================== DOCTOR ROUTES ====================

  @Post('doctor/lesson/:lessonId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Create a quiz for a lesson (Doctor only)' })
  async createQuiz(
    @CurrentUser('id') doctorId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Body() createQuizDto: CreateQuizDto,
  ) {
    return this.quizzesService.createQuiz(doctorId, lessonId, createQuizDto);
  }

  @Put('doctor/:quizId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Update a quiz (Doctor only)' })
  async updateQuiz(
    @CurrentUser('id') doctorId: string,
    @Param('quizId', ParseUUIDPipe) quizId: string,
    @Body() updateData: Partial<CreateQuizDto>,
  ) {
    return this.quizzesService.updateQuiz(doctorId, quizId, updateData);
  }

  @Delete('doctor/:quizId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Delete a quiz (Doctor only)' })
  async deleteQuiz(
    @CurrentUser('id') doctorId: string,
    @Param('quizId', ParseUUIDPipe) quizId: string,
  ) {
    return this.quizzesService.deleteQuiz(doctorId, quizId);
  }

  @Post('doctor/:quizId/questions')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Add a question to a quiz (Doctor only)' })
  async addQuestion(
    @CurrentUser('id') doctorId: string,
    @Param('quizId', ParseUUIDPipe) quizId: string,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.quizzesService.addQuestion(doctorId, quizId, createQuestionDto);
  }

  @Put('doctor/questions/:questionId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Update a question (Doctor only)' })
  async updateQuestion(
    @CurrentUser('id') doctorId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body() updateData: any,
  ) {
    return this.quizzesService.updateQuestion(doctorId, questionId, updateData);
  }

  @Delete('doctor/questions/:questionId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Delete a question (Doctor only)' })
  async deleteQuestion(
    @CurrentUser('id') doctorId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    return this.quizzesService.deleteQuestion(doctorId, questionId);
  }

  @Get('doctor/:quizId/results')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Get quiz results (Doctor only)' })
  async getQuizResults(
    @CurrentUser('id') doctorId: string,
    @Param('quizId', ParseUUIDPipe) quizId: string,
  ) {
    return this.quizzesService.getQuizResults(doctorId, quizId);
  }

  // ==================== STUDENT ROUTES ====================

  @Get('student/:quizId')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get quiz for student (Student only, must be enrolled)' })
  async getQuizForStudent(
    @CurrentUser('id') studentId: string,
    @Param('quizId', ParseUUIDPipe) quizId: string,
  ) {
    return this.quizzesService.getQuizForStudent(studentId, quizId);
  }

  @Post('student/:quizId/start')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Start a quiz attempt (Student only)' })
  async startQuizAttempt(
    @CurrentUser('id') studentId: string,
    @Param('quizId', ParseUUIDPipe) quizId: string,
  ) {
    return this.quizzesService.startQuizAttempt(studentId, quizId);
  }

  @Post('student/attempts/:attemptId/submit')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Submit quiz answers (Student only)' })
  async submitQuiz(
    @CurrentUser('id') studentId: string,
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @Body() submitQuizDto: SubmitQuizDto,
  ) {
    return this.quizzesService.submitQuiz(studentId, attemptId, submitQuizDto);
  }

  @Get('student/attempts')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get student\'s quiz attempts (Student only)' })
  async getStudentAttempts(@CurrentUser('id') studentId: string) {
    return this.quizzesService.getStudentAttempts(studentId);
  }

  @Get('student/attempts/:attemptId')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get attempt details (Student only)' })
  async getAttemptDetails(
    @CurrentUser('id') studentId: string,
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
  ) {
    return this.quizzesService.getAttemptDetails(studentId, attemptId);
  }
}
