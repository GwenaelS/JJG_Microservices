import { Module } from '@nestjs/common';
import { UserGatewayController } from './user-gateway.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [UserGatewayController],
  providers: [],
})
export class UserGatewayModule {}
