import { Module } from '@nestjs/common';
import { ResponseMappings } from './utils/ResponseMappings';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ResponseMappings],
  exports: [ResponseMappings, HttpModule],
})
export class SharedModule {}
