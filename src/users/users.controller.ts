import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Request,
  ForbiddenException,  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';


@Controller('users')
//@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
   @UseGuards(AuthGuard('jwt'), RolesGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
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
