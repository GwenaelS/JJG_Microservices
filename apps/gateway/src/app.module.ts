import { Module } from '@nestjs/common';
import { UserGatewayModule } from './user/user-gateway.module';
//import { PostGatewayModule } from './post/post-gateway.module';

@Module({
  imports: [
    UserGatewayModule,
    //PostGatewayModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
