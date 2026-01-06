import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { Role } from '@prisma/client';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Put('password')
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Get('doctors')
  @ApiOperation({ summary: 'Get all doctors/instructors' })
  async getAllDoctors() {
    return this.usersService.findAllDoctors();
  }

  @Get('students')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Get all students (Doctor/Admin only)' })
  async getAllStudents() {
    return this.usersService.findAllStudents();
  }

  @Get('doctor/stats')
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Get doctor statistics (Doctor only)' })
  async getDoctorStats(@CurrentUser('id') doctorId: string) {
    return this.usersService.getDoctorStats(doctorId);
  }

  @Get('student/stats')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get student statistics (Student only)' })
  async getStudentStats(@CurrentUser('id') studentId: string) {
    return this.usersService.getStudentStats(studentId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }
}
