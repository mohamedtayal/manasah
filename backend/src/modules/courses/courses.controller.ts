import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser, Public } from '../../common/decorators';
import { Role } from '@prisma/client';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ==================== PUBLIC ROUTES ====================

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all published courses (Public)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'level', required: false, type: String })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('level') level?: string,
  ) {
    return this.coursesService.findAllPublished(page, limit, category, level);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all course categories (Public)' })
  async getCategories() {
    return this.coursesService.getCategories();
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get course by slug (Public)' })
  async findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  // ==================== DOCTOR ROUTES ====================

  @Get('doctor/my-courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get doctor\'s courses (Doctor only)' })
  async getDoctorCourses(@CurrentUser('id') doctorId: string) {
    return this.coursesService.findByDoctor(doctorId);
  }

  @Post('doctor/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new course (Doctor only)' })
  async create(
    @CurrentUser('id') doctorId: string,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.coursesService.create(doctorId, createCourseDto);
  }

  @Put('doctor/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a course (Doctor only, own courses)' })
  async update(
    @Param('id', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') doctorId: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(courseId, doctorId, updateCourseDto);
  }

  @Post('doctor/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Publish a course (Doctor only)' })
  async publish(
    @Param('id', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') doctorId: string,
  ) {
    return this.coursesService.publish(courseId, doctorId);
  }

  @Post('doctor/:id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Archive a course (Doctor only)' })
  async archive(
    @Param('id', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') doctorId: string,
  ) {
    return this.coursesService.archive(courseId, doctorId);
  }

  @Delete('doctor/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a course (Doctor only, no enrollments)' })
  async delete(
    @Param('id', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') doctorId: string,
  ) {
    return this.coursesService.delete(courseId, doctorId);
  }

  @Get('doctor/:id/students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get students enrolled in a course (Doctor only)' })
  async getCourseStudents(
    @Param('id', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') doctorId: string,
  ) {
    return this.coursesService.getCourseStudents(courseId, doctorId);
  }

  // ==================== AUTHENTICATED ROUTES ====================

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get course by ID (Authenticated)' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findById(id);
  }
}
