import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  ForbiddenException,
  Request,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { TravelerService } from './traveler.service';
import { CreateTravelerDto } from './create-traveler.dto';
import { UpdateTravelerDto } from './update-traveler.dto';
import { LoginDto } from './login.dto';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookingEntity } from './booking.entity';

@Controller('traveler')
export class TravelerController {
  constructor(private readonly travelerService: TravelerService, private readonly authService: AuthService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateTravelerDto) {
    return this.travelerService.create(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @Get()
  async findAll() {
    return this.travelerService.findAll();
  }

  @Get('find/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.travelerService.findById(id);
  }

  @Put('update/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTravelerDto) {
    return this.travelerService.update(id, dto);
  }

  @Patch('patch/:id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async patch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTravelerDto) {
    return this.travelerService.partialUpdate(id, dto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.travelerService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/profile')
  async createProfile(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.travelerService.createProfile(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/profile')
  async getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.travelerService.getProfile(id);
  }

  @UseGuards(JwtAuthGuard)
@Put(':id/profile')
async updateProfile(
  @Param('id', ParseIntPipe) id: number,
  @Body() data: any,
  @Request() req, 
) {
  if (req.user.userId !== id) {
    throw new ForbiddenException('You can only update your own profile');
  }
  return this.travelerService.updateProfile(id, data);
}


  @UseGuards(JwtAuthGuard)
  // @Post(':id/bookings')
  // async createBooking(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
  //   return this.travelerService.createBooking(id, data);
  // }
@Post(':id/bookings')
async createBooking(
  @Param('id', ParseIntPipe) id: number,
  @Body() data: any
) {
  return this.travelerService.createBooking(id, data);
}



  @UseGuards(JwtAuthGuard)
  @Get(':id/bookings')
  async listBookings(@Param('id', ParseIntPipe) id: number) {
    return this.travelerService.listBookings(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/bookings/:bid')
  async deleteBooking(@Param('id', ParseIntPipe) id: number, @Param('bid', ParseIntPipe) bid: number) {
    return this.travelerService.deleteBooking(id, bid);
  }
}
