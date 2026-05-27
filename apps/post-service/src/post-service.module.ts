import { Module } from '@nestjs/common';
import { PostServiceController } from './post-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post-entities/post.entities';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 50000, // 50 secondes
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'microgroupe_db_post',
      entities: [PostEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([PostEntity]),
  ],
  controllers: [PostServiceController],
  providers: [],
})
export class PostServiceModule {}
