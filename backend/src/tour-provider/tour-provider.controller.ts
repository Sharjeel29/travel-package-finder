import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UsePipes,
} from '@nestjs/common';
import { TourProviderService } from './tour-provider.service';
import { CreateTourProviderDto } from '../dto/create-tour-provider.dto';
import { User4ValidationPipe } from '../pipes/user4-validation.pipe';

@Controller('tour-provider')
export class TourProviderController {
  constructor(private service: TourProviderService) {}

  // 1. CREATE USER
  @Post()
  @UsePipes(new User4ValidationPipe())
  create(@Body() body: CreateTourProviderDto) {
    return this.service.create(body);
  }

  // 2. UPDATE COUNTRY
  @Patch(':id')
  updateCountry(
    @Param('id') id: number,
    @Query('country') country: string,
  ) {
    return this.service.updateCountry(id, country);
  }

  // 3. GET BY JOINING DATE
  @Get('by-date')
  filterByDate(@Query('date') date: string) {
    return this.service.findByJoiningDate(date);
  }

  // 4. USERS WITH default 'Unknown'
  @Get('unknown')
  getUnknownCountryUsers() {
    return this.service.findUnknownCountryUsers();
  }

  // Extra routes to complete 8

  // 5. GET ALL USERS
  @Get()
  getAll() {
    return this.service.findAll();
  }

  // 6. GET SINGLE USER
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // 7. Search country using Query
  @Get('search/country')
  search(@Query('country') country: string) {
    return { message: 'Query example', country };
  }

  // 8. Body Example
  @Post('demo')
  demo(@Body() body: any) {
    return { received: body };
  }
}
