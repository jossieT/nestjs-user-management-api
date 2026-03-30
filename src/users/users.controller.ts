import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Request,
  ForbiddenException,  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';


@Controller('users')
//@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    const user = req.user; // { userId, mobileNumber, role }
    // Allow if admin/super admin OR the ID matches the authenticated user's ID
    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN || user.userId === id) {
      return this.usersService.findOne(id);
    }
    throw new ForbiddenException('You don\'t have access to perform this action');
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const user = req.user
    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN || user.userId === id){
        return this.usersService.update(id, updateUserDto);
    }
    throw new ForbiddenException('You don\'t have access to perform this action')
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async remove(@Param('id') id: string, @Request() req) {
    const user = req.user;
    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN || user.userId == id){
        return this.usersService.remove(id);
    }
    throw new ForbiddenException('You can only delete your own profile');
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getProfile(@Request() req) {
    const userId = req.userId;
    return this.usersService.findOne(userId);
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  adminOnly() {
    return 'This is only for admins';
  }

  @Get('moderator')
  @Roles(Role.MODERATOR, Role.ADMIN)
  moderatorOrAdmin() {
    return 'Moderator or admin area';
  }

}
