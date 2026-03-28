import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
    constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

   async validateUser(mobileNumber: string, password: string): Promise<any> {
    const user = await this.usersService.findByMobileNumber(mobileNumber);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Remove password before returning user object
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async login(loginDto: LoginDto) {
    const { mobileNumber, password } = loginDto;
    const user = await this.validateUser(mobileNumber, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, mobileNumber: user.mobileNumber, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
