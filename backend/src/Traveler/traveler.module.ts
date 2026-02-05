import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelerController } from './traveler.controller';
import { TravelerService } from './traveler.service';
import { TravelerEntity } from './traveler.entity';
import { ProfileEntity } from './profile.entity';
import { BookingEntity } from './booking.entity';
import { AuthModule } from '../auth/auth.module';
import { PusherService } from '../pusher/pusher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelerEntity, ProfileEntity, BookingEntity]),
    AuthModule,
    // Mailer  
  ],
  controllers: [TravelerController],
  providers: [TravelerService,PusherService],
  exports: [TravelerService],
})
export class TravelerModule {}
