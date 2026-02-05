import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TourProvider } from './tour-provider.entity';
import { CreateTourProviderDto } from '../dto/create-tour-provider.dto';

@Injectable()
export class TourProviderService {
  constructor(
    @InjectRepository(TourProvider)
    private repo: Repository<TourProvider>,
  ) {}

  // 1. Create user
  create(data: CreateTourProviderDto) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  // 2. Update country
  async updateCountry(id: number, country: string) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    user.country = country;
    return this.repo.save(user);
  }

  // 3. Get by joining date
  findByJoiningDate(date: string) {
    return this.repo.find({
      where: {
        joiningDate: new Date(date),
      },
    });
  }

  // 4. Users with country = Unknown
  findUnknownCountryUsers() {
    return this.repo.find({
      where: { country: 'Unknown' },
    });
  }

  // EXTRA ROUTES FOR TOTAL = 8
  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
