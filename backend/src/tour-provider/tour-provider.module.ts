import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourProvider } from './tour-provider.entity';
import { TourProviderController } from './tour-provider.controller';
import { TourProviderService } from './tour-provider.service';

@Module({
  imports: [TypeOrmModule.forFeature([TourProvider])],
  controllers: [TourProviderController],
  providers: [TourProviderService],
})
export class TourProviderModule {}
