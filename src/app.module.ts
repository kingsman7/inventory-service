import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { InventoryController } from './inventory/inventory.controller.js';
import { InventoryService } from './inventory/inventory.service.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService, AppService],
})
export class AppModule {}