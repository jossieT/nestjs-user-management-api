import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const userData: Prisma.UserCreateInput = {
    ...createUserDto,
    password: hashedPassword,
  };
  try {
    return await this.prisma.user.create({
      data: userData,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
    }
    throw error;
  }
}

  async findAll() {
    return await this.prisma.user.findMany({
    select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    username: true,
    mobileNumber: true,
    phone: true,
    avatar: true,
    isActive: true,
    isLocked: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
  }
    });
  }


  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true, 
        lastName: true, 
        username: true, 
        mobileNumber: true, 
        phone: true, 
        avatar: true,
        isActive: true,
        isLocked: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if(!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByMobileNumber(mobileNumber: string) {
    const user = await this.prisma.user.findUnique({
      where: { mobileNumber },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        mobileNumber: true, 
        isActive: true,
        isLocked: true,
      }
    });

    if(!user) {
      throw new NotFoundException(`User with id ${mobileNumber} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        mobileNumber: true,
        phone: true,
        avatar: true,
        isActive: true,
        isLocked: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      });
    } catch (error) {
      throw new NotFoundException(`User with id ${id} not found`);
    }  
  }


  async  remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`User With ID ${id} not found`);
    }
  }
}
