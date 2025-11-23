import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Get()
  findAll() {
    return this.concertsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.concertsService.findById(id);
  }

  @Post()
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertsService.create(
      createConcertDto.name,
      createConcertDto.description,
      createConcertDto.totalSeats,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    // Note: Service only has updateAvailableSeats, but for now we might need more.
    // Checking service capabilities... Service only has updateAvailableSeats.
    // For general updates, we might need to extend the service, but let's stick to what's available or extend if needed.
    // The frontend api.ts calls update with Partial<Concert>.
    // Let's implement a basic update in service if it's missing or just handle seats for now if that's the critical part.
    // Wait, the plan said "update (updates concert details and seats)".
    // I should check if I need to add update method to service.
    // For now, let's assume I need to add it.
    return this.concertsService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.concertsService.delete(id);
  }
}
