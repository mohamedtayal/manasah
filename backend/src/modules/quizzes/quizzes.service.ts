import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== DOCTOR METHODS ====================

  async createQuiz(doctorId: string, lessonId: string, createQuizDto: CreateQuizDto) {
    await this.verifyLessonOwnership(lessonId, doctorId);

    return this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        titleAr: createQuizDto.titleAr,
        description: createQuizDto.description,
        timeLimit: createQuizDto.timeLimit,
        passingScore: createQuizDto.passingScore || 60,
        lessonId,
      },
    });
  }

  async updateQuiz(doctorId: string, quizId: string, updateData: Partial<CreateQuizDto>) {
    const quiz = await this.getQuizWithOwnerCheck(quizId, doctorId);

    return this.prisma.quiz.update({
      where: { id: quizId },
      data: updateData,
    });
  }

  async deleteQuiz(doctorId: string, quizId: string) {
    await this.getQuizWithOwnerCheck(quizId, doctorId);

    return this.prisma.quiz.delete({
      where: { id: quizId },
    });
  }

  async addQuestion(doctorId: string, quizId: string, createQuestionDto: CreateQuestionDto) {
    await this.getQuizWithOwnerCheck(quizId, doctorId);

    // Get next order
    const lastQuestion = await this.prisma.question.findFirst({
      where: { quizId },
      orderBy: { order: 'desc' },
    });

    return this.prisma.question.create({
      data: {
        text: createQuestionDto.text,
        textAr: createQuestionDto.textAr,
        type: createQuestionDto.type,
        points: createQuestionDto.points || 1,
        explanation: createQuestionDto.explanation,
        explanationAr: createQuestionDto.explanationAr,
        order: lastQuestion ? lastQuestion.order + 1 : 1,
        quizId,
        options: {
          create: createQuestionDto.options.map((opt, index) => ({
            text: opt.text,
            textAr: opt.textAr,
            isCorrect: opt.isCorrect,
            order: index + 1,
          })),
        },
      },
      include: {
        options: true,
      },
    });
  }

  async updateQuestion(doctorId: string, questionId: string, updateData: any) {
    await this.getQuestionWithOwnerCheck(questionId, doctorId);

    return this.prisma.question.update({
      where: { id: questionId },
      data: {
        text: updateData.text,
        textAr: updateData.textAr,
        type: updateData.type,
        points: updateData.points,
        explanation: updateData.explanation,
        explanationAr: updateData.explanationAr,
      },
    });
  }

  async deleteQuestion(doctorId: string, questionId: string) {
    await this.getQuestionWithOwnerCheck(questionId, doctorId);

    return this.prisma.question.delete({
      where: { id: questionId },
    });
  }

  async getQuizResults(doctorId: string, quizId: string) {
    await this.getQuizWithOwnerCheck(quizId, doctorId);

    return this.prisma.quizAttempt.findMany({
      where: { quizId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  // ==================== STUDENT METHODS ====================

  async getQuizForStudent(studentId: string, quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            text: true,
            textAr: true,
            type: true,
            points: true,
            order: true,
            options: {
              select: {
                id: true,
                text: true,
                textAr: true,
                order: true,
                // Don't include isCorrect!
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check enrollment
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId: studentId,
        courseId: quiz.lesson.module.course.id,
        status: 'ACTIVE',
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled to take this quiz');
    }

    return quiz;
  }

  async startQuizAttempt(studentId: string, quizId: string) {
    // Check if student can take quiz
    await this.getQuizForStudent(studentId, quizId);

    // Check for incomplete attempts
    const incompleteAttempt = await this.prisma.quizAttempt.findFirst({
      where: {
        userId: studentId,
        quizId,
        completedAt: null,
      },
    });

    if (incompleteAttempt) {
      return incompleteAttempt;
    }

    // Create new attempt
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
      },
    });

    const totalPoints = quiz!.questions.reduce((sum, q) => sum + q.points, 0);

    return this.prisma.quizAttempt.create({
      data: {
        userId: studentId,
        quizId,
        totalPoints,
      },
    });
  }

  async submitQuiz(studentId: string, attemptId: string, submitQuizDto: SubmitQuizDto) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    if (attempt.userId !== studentId) {
      throw new ForbiddenException('This is not your quiz attempt');
    }

    if (attempt.completedAt) {
      throw new BadRequestException('This quiz has already been submitted');
    }

    let totalScore = 0;

    // Process answers
    const answerPromises = submitQuizDto.answers.map(async (answer) => {
      const question = attempt.quiz.questions.find((q) => q.id === answer.questionId);

      if (!question) {
        return null;
      }

      let isCorrect = false;
      let pointsEarned = 0;

      if (answer.selectedOptionId) {
        const selectedOption = question.options.find(
          (o) => o.id === answer.selectedOptionId,
        );

        if (selectedOption?.isCorrect) {
          isCorrect = true;
          pointsEarned = question.points;
          totalScore += pointsEarned;
        }
      }

      return this.prisma.answer.create({
        data: {
          attemptId,
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          textAnswer: answer.textAnswer,
          isCorrect,
          pointsEarned,
        },
      });
    });

    await Promise.all(answerPromises);

    // Calculate percentage
    const percentage = (totalScore / attempt.totalPoints) * 100;
    const passed = percentage >= attempt.quiz.passingScore;

    // Update attempt
    return this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score: totalScore,
        percentage,
        passed,
        completedAt: new Date(),
      },
      include: {
        answers: {
          include: {
            question: {
              include: {
                options: true,
              },
            },
            selectedOption: true,
          },
        },
      },
    });
  }

  async getStudentAttempts(studentId: string, quizId?: string) {
    const where: any = { userId: studentId };
    
    if (quizId) {
      where.quizId = quizId;
    }

    return this.prisma.quizAttempt.findMany({
      where,
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            titleAr: true,
            passingScore: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async getAttemptDetails(studentId: string, attemptId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                options: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
        answers: {
          include: {
            question: true,
            selectedOption: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.userId !== studentId) {
      throw new ForbiddenException('This is not your quiz attempt');
    }

    return attempt;
  }

  // ==================== HELPER METHODS ====================

  private async verifyLessonOwnership(lessonId: string, doctorId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.module.course.instructorId !== doctorId) {
      throw new ForbiddenException('You do not have permission to modify this lesson');
    }

    return lesson;
  }

  private async getQuizWithOwnerCheck(quizId: string, doctorId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.lesson.module.course.instructorId !== doctorId) {
      throw new ForbiddenException('You do not have permission to modify this quiz');
    }

    return quiz;
  }

  private async getQuestionWithOwnerCheck(questionId: string, doctorId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.quiz.lesson.module.course.instructorId !== doctorId) {
      throw new ForbiddenException('You do not have permission to modify this question');
    }

    return question;
  }
}
