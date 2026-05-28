import { Controller, Get, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostEntity } from './post-entities/post.entities';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from '@app/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller()
export class PostServiceController {
  constructor(
    @InjectRepository(PostEntity)
    private readonly PostRepository: Repository<PostEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // =========================================================================
  // BROWSE POSTS
  // =========================================================================

  @MessagePattern('Browse_post')
  async browse() {
    const cachePosts = await this.cacheManager.get('POST:*');
    console.log(cachePosts);
    if (cachePosts) {
      return cachePosts;
    }

    const posts = this.PostRepository.find();
    await this.cacheManager.set('POST:*', posts);
    return posts;
  }

  // =========================================================================
  // READ POST
  // =========================================================================

  @MessagePattern('Read_post')
  async read(id: number) {
    const cachePost = await this.cacheManager.get(`POST:${id}`);
    console.log(cachePost);
    if (cachePost) {
      return cachePost;
    }

    const post = this.PostRepository.findOneBy({ id });
    await this.cacheManager.set(`POST:${id}`, post);
    return post;
  }

  // =========================================================================
  // EDIT POST
  // =========================================================================

  @MessagePattern('Edit_post')
  async edit(payload: {
    id: number;
    updateDto: UpdatePostDto;
  }): Promise<PostEntity> {
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

    // Suppression des caches obsolètes
    await this.cacheManager.del('POST:*');
    await this.cacheManager.del(`POST:${id}`);

    // 3. Fusion et sauvegarde
    const updatePost = this.PostRepository.merge(doesPostExist, updateDto);
    return await this.PostRepository.save(updatePost);
  }

  // =========================================================================
  // ADD POST
  // =========================================================================

  @MessagePattern('Add_post')
  async add(CreatePostDto: CreatePostDto): Promise<PostEntity> {
    const doesPostExist = await this.PostRepository.findOne({
      where: { title: CreatePostDto.title },
    });

    if (doesPostExist) {
      throw new Error('Le titre est déja utilisé');
    }

    // Suppression du cache obsolète
    await this.cacheManager.del('POST:*');

    const newPost = this.PostRepository.create(CreatePostDto);
    return await this.PostRepository.save(newPost);
  }

  // =========================================================================
  // DESTROY POSTS
  // =========================================================================

  @MessagePattern('Destroy_post')
  async destroy(id: number) {
    // Suppression des caches obsolètes
    await this.cacheManager.del('POST:*');
    await this.cacheManager.del(`POST:${id}`);
    return this.PostRepository.delete({ id });
  }
}
