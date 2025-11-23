import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConcertsService } from './concerts.service';
import { Concert, ConcertSchema } from './entities/concert.entity';

import { ConcertsController } from './concerts.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Concert.name, schema: ConcertSchema }])],
  controllers: [ConcertsController],
  providers: [ConcertsService],
  exports: [ConcertsService],
})
export class ConcertsModule { }
