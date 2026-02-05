import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TravelerEntity } from './traveler.entity';
import { ProfileEntity } from './profile.entity';
import { BookingEntity } from './booking.entity';
import { CreateTravelerDto } from './create-traveler.dto';
import { UpdateTravelerDto } from './update-traveler.dto';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class TravelerService {
  constructor(
    @InjectRepository(TravelerEntity) private travelerRepo: Repository<TravelerEntity>,
    @InjectRepository(ProfileEntity) private profileRepo: Repository<ProfileEntity>,
    @InjectRepository(BookingEntity) private bookingRepo: Repository<BookingEntity>,
     private readonly pusherService: PusherService,
  
  ) {}

  private async getTravelerOrThrow(id: number): Promise<TravelerEntity> {
    const traveler = await this.travelerRepo.findOne({ where: { id } });
    if (!traveler) {
      throw new HttpException('Traveler not found', HttpStatus.NOT_FOUND);
    }
    return traveler;
  }

  async create(dto: CreateTravelerDto): Promise<TravelerEntity> {
    const exists = await this.travelerRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new HttpException('Email already in use', HttpStatus.CONFLICT);

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(dto.password, salt);

    const user = this.travelerRepo.create({ ...dto, password: hashed });
    return this.travelerRepo.save(user);
  }

  async loginValidate(email: string, password: string): Promise<any> {
    const user = await this.travelerRepo.findOne({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _p, ...rest } = user as any;
    return rest;
  }

  async findAll(): Promise<TravelerEntity[]> {
    return this.travelerRepo.find();
  }

  async findById(id: number): Promise<TravelerEntity> {
    return this.getTravelerOrThrow(id);
  }

  async update(id: number, dto: UpdateTravelerDto): Promise<TravelerEntity> {
    await this.getTravelerOrThrow(id);

    if (dto.password) {
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    await this.travelerRepo.update(id, dto as any);
    const updated = await this.travelerRepo.findOne({ where: { id } });
    return updated as TravelerEntity;
  }

  async partialUpdate(id: number, dto: UpdateTravelerDto): Promise<TravelerEntity> {
    return this.update(id, dto);
  }

  async remove(id: number): Promise<{ deleted: true }> {
    await this.getTravelerOrThrow(id);
    await this.travelerRepo.delete(id);
    return { deleted: true };
  }

  // one to one
  async createProfile(travelerId: number, data: any): Promise<ProfileEntity> {
    const traveler = await this.getTravelerOrThrow(travelerId);

    const existing = await this.profileRepo.findOne({
      where: { traveler: { id: travelerId } } as any,
      relations: ['traveler'],
    });

    if (existing) throw new HttpException('Profile already exists', HttpStatus.BAD_REQUEST);

    const profile = (this.profileRepo.create(data as any) as unknown) as ProfileEntity;
    profile.traveler = traveler;
    return this.profileRepo.save(profile);
  }

  async getProfile(travelerId: number): Promise<ProfileEntity> {
    const profile = await this.profileRepo.findOne({
      where: { traveler: { id: travelerId } } as any,
      relations: ['traveler'],
    });

    if (!profile) throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    return profile;
  }

  async updateProfile(travelerId: number, data: any): Promise<ProfileEntity> {
    const profile = await this.profileRepo.findOne({
      where: { traveler: { id: travelerId } } as any,
      relations: ['traveler'],
    });

    if (!profile) {
      const traveler = await this.getTravelerOrThrow(travelerId);
      const newProfile = (this.profileRepo.create(data as any) as unknown) as ProfileEntity;
      newProfile.traveler = traveler;
      return this.profileRepo.save(newProfile);
    }

    await this.profileRepo.update(profile.id, data as any);
    const refreshed = await this.profileRepo.findOne({ where: { id: profile.id } as any });
    if (!refreshed) {
      throw new HttpException('Profile not found after update', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return refreshed;
  }

  // one to many
  // async createBooking(travelerId: number, data: any): Promise<BookingEntity> {
  //   const traveler = await this.getTravelerOrThrow(travelerId);

  //   const booking = (this.bookingRepo.create(data as any) as unknown) as BookingEntity;
  //   booking.traveler = traveler;
  //   return this.bookingRepo.save(booking);
  // }


  
  // one to many


async createBooking(
  travelerId: number,
  data: any
): Promise<BookingEntity | BookingEntity[]> {
  const traveler = await this.getTravelerOrThrow(travelerId);

  const booking = this.bookingRepo.create({
    ...data,
    traveler,
  });

  const savedBooking = await this.bookingRepo.save(booking);

  // 🔔 PUSHER EVENT
  await this.pusherService.trigger(
    'notifications',
    'booking-created',
    {
      message: 'New booking created',
      travelerId,
    },
  );

  return savedBooking;
}




  async listBookings(travelerId: number): Promise<BookingEntity[]> {
    return this.bookingRepo.find({
      where: { traveler: { id: travelerId } } as any,
      relations: ['traveler'],
    });
  }

  async deleteBooking(
    travelerId: number,
    bookingId: number,
  ): Promise<{ deleted: true }> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId } as any,
      relations: ['traveler'],
    });

    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }

    if (!booking.traveler || booking.traveler.id !== travelerId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    await this.bookingRepo.delete(bookingId);
    return { deleted: true };
  }

  



  // async listBookings(travelerId: number): Promise<BookingEntity[]> {
  //   return this.bookingRepo.find({
  //     where: { traveler: { id: travelerId } } as any,
  //     relations: ['traveler'],
  //   });
  // }


//   async listBookings(travelerId: number): Promise<Partial<BookingEntity>[]> {
//   return this.bookingRepo.find({
//     select: ['id', 'packageId', 'seats'], // only these fields
//     where: { traveler: { id: travelerId } } as any,
//   });
// }



  // async deleteBooking(travelerId: number, bookingId: number): Promise<{ deleted: true }> {
  //   const booking = await this.bookingRepo.findOne({
  //     where: { id: bookingId } as any,
  //     relations: ['traveler'],
  //   });

  //   if (!booking) throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
  //   if (!booking.traveler || booking.traveler.id !== travelerId) {
  //     throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  //   }

  //   await this.bookingRepo.delete(bookingId);
  //   return { deleted: true };
  // }
}
