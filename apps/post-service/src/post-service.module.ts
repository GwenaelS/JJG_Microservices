import { Module } from '@nestjs/common';
import { PostServiceController } from './post-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post-entities/post.entities';

@Module({
  imports: [
  TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'microgroupe_db_user',
        entities: [PostEntity],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([PostEntity]),
    ],
  controllers: [PostServiceController],
  providers: [],
})
export class PostServiceModule {}
