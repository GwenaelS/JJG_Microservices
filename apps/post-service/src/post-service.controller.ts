import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostEntity } from './post-entities/post.entities';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from '@app/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

@Controller()
export class PostServiceController {
  constructor(
    @InjectRepository(PostEntity)
    private readonly PostRepository: Repository<PostEntity>,
  ) {}

  @MessagePattern('Browse_post')
  browse() {
    return this.PostRepository.find();
  }

  @MessagePattern('Read_post')
  read(id: number) {
    return this.PostRepository.findOneBy({ id });
  }

  @MessagePattern('Edit_post')
async edit(payload: { id: number; updateDto: UpdatePostDto }): Promise<PostEntity> {
  
  // 1. On extrait proprement l'id et le DTO du payload reçu
  const { id, updateDto } = payload;

  console.log('ID extrait :', id);        
  console.log('Data extraite :', updateDto);

  if (!id) {
    throw new RpcException("L'ID de l'article est manquant dans le payload");
  }

  // 2. Recherche en base de données
  const doesPostExist = await this.PostRepository.findOne({
    where: { id: Number(id) },
  });

  if (!doesPostExist) {
    throw new RpcException("L'article n'existe pas en base de données");
  } 

  // 3. Fusion et sauvegarde
  const updatePost = this.PostRepository.merge(doesPostExist, updateDto);
  return await this.PostRepository.save(updatePost);
}

  @MessagePattern('Add_post')
  async add(CreatePostDto: CreatePostDto): Promise<PostEntity> {
    const doesPostExist = await this.PostRepository.findOne({
      where: { title: CreatePostDto.title },
    });

    if (doesPostExist) {
      throw new Error("Le titre est déja utilisé");
    }

    const newPost = this.PostRepository.create(CreatePostDto);
    return await this.PostRepository.save(newPost);
  }

  @MessagePattern('Destroy_post')
  destroy(id: number) {
    return this.PostRepository.delete({ id });
  }
}

