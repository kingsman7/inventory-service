import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // 1. Crear app HTTP
  const app = await NestFactory.create(AppModule);

  // 2. Conectar el listener de Kafka como Microservicio
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'inventory-service',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'inventory-consumer-group', // Grupo único para no interferir con otros servicios
      },
    },
  });

  // 3. Iniciar escuchas
  await app.startAllMicroservices();
  
  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`🚀 Inventory Service corriendo en HTTP: http://localhost:${port} y escuchando Kafka`);
}
bootstrap();