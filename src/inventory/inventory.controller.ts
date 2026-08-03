import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InventoryService } from './inventory.service.js';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Endpoint HTTP para inicializar stock de una variante
  @Post('set')
  async setStock(@Body() body: { variantId: string; stock: number }) {
    return this.inventoryService.setStock(body.variantId, body.stock);
  }

  @Get(':variantId')
  async getStock(@Param('variantId') variantId: string) {
    return this.inventoryService.getStock(variantId);
  }

  // Listener de Eventos de Kafka
  @EventPattern('order.created')
  async handleOrderCreated(@Payload() message: any) {
    console.log('⚡ Evento [order.created] recibido desde Kafka en InventoryService!');
    // Manejar payloads que puedan venir parseados o como String
    const eventData = typeof message === 'string' ? JSON.parse(message) : message;
    
    if (eventData.payload) {
      await this.inventoryService.processOrderCreated(eventData.payload);
    }
  }
}