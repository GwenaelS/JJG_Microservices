import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '@app/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller()
export class UserServiceController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // =========================================================================
  // BROWSE USERS
  // =========================================================================

  @MessagePattern('Browse_user')
  async browse() {
    // Verification si browse users est dans le cache
    const cacheUsers = await this.cacheManager.get('USER:*');
    console.log(cacheUsers);
    if (cacheUsers) {
      // Si oui return le cache
      return cacheUsers;
    }
    const users = this.UserRepository.find();
    await this.cacheManager.set('USER:*', users);
    return users;
  }

  // =========================================================================
  // READ USER
  // =========================================================================

  @MessagePattern('Read_user')
  async read(id: number) {
    const cacheUser = await this.cacheManager.get(`USER:${id}`);
    console.log(cacheUser);
    if (cacheUser) {
      return cacheUser;
    }

    const user = this.UserRepository.findOneBy({ id });
    await this.cacheManager.set(`USER:${id}`, user);
    return user;
  }

  // =========================================================================
  // EDIT USER
  // =========================================================================

  @MessagePattern('Edit_user')
  async edit(payload: {
    id: number;
    updateDto: UpdateUserDto;
  }): Promise<UserEntity> {
    // 1. On extrait proprement l'id et le DTO du payload reçu
    const { id, updateDto } = payload;

    console.log('ID extrait :', id); // Devrait afficher: 12
    console.log('Data extraite :', updateDto); // Devrait afficher: { name: 'tota' }

    if (!id) {
      throw new RpcException(
        "L'ID de l'utilisateur est manquant dans le payload",
      );
    }

    // 2. Recherche en base de données
    const doesUserExist = await this.UserRepository.findOne({
      where: { id: Number(id) },
    });

    if (!doesUserExist) {
      throw new RpcException("L'utilisateur n'existe pas en base de données");
    }

    // Suppression des caches obsolètes
    await this.cacheManager.del('USER:*');
    await this.cacheManager.del(`USER:${id}`);

    // 3. Fusion et sauvegarde
    const updateUser = this.UserRepository.merge(doesUserExist, updateDto);
    return await this.UserRepository.save(updateUser);
  }

  // =========================================================================
  // ADD USER
  // =========================================================================

  @MessagePattern('Add_user')
  async add(CreateUserDto: CreateUserDto): Promise<UserEntity> {
    const doesUserExist = await this.UserRepository.findOne({
      where: { email: CreateUserDto.email },
    });

    if (doesUserExist) {
      throw new Error("L'email est déja utilisé");
    }

    // Suppression du cache obsolète
    await this.cacheManager.del('USER:*');

    const newUser = this.UserRepository.create(CreateUserDto);
    return await this.UserRepository.save(newUser);
  }

  // =========================================================================
  // DESTROY USERS
  // =========================================================================

  @MessagePattern('Destroy_user')
  async destroy(id: number) {
    // Suppression des caches obsolètes
    await this.cacheManager.del('USER:*');
    await this.cacheManager.del(`USER:${id}`);
    return this.UserRepository.delete({ id });
  }
}
