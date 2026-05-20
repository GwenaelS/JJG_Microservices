import { Module } from '@nestjs/common';
import { PostGatewayController } from './post-gateway.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
          {
            name: 'POST_SERVICE',
            transport: Transport.TCP,
            options: {
              host: 'localhost',
              port: 3002,
            },
          },
        ]),
  ],
  controllers: [PostGatewayController],
  providers: [],
})
export class PostGatewayModule {}
