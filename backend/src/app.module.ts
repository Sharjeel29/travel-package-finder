import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourProviderModule } from './tour-provider/tour-provider.module';
import { TravelerModule } from './Traveler/traveler.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root90',   
      database: 'travel_db',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    TourProviderModule,
    TravelerModule
  ],
})
export class AppModule {}
