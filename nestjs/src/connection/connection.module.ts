import { Module } from '@nestjs/common';
import { ConnectionManager } from './connection-manager.service';

@Module({
  providers: [ConnectionManager],
  exports: [ConnectionManager],
})
export class ConnectionModule {}
