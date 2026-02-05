import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TravelerEntity } from '../Traveler/traveler.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TravelerEntity)
    private travelerRepo: Repository<TravelerEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    if (!email || !pass) return null;
    const user = await this.travelerRepo.findOne({ where: { email } });
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return null;
     const { password, ...rest } = user as any;
      return rest;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
