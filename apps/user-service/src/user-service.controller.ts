import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '@app/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

@Controller()
export class UserServiceController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {}

  @MessagePattern('Browse_user')
  browse() {
    return this.UserRepository.find();
  }

  @MessagePattern('Read_user')
  read(id: number) {
    return this.UserRepository.findOneBy({ id });
  }

  @MessagePattern('Edit_user')
async edit(payload: { id: number; updateDto: UpdateUserDto }): Promise<UserEntity> {
  
  // 1. On extrait proprement l'id et le DTO du payload reçu
  const { id, updateDto } = payload;

  console.log('ID extrait :', id);         // Devrait afficher: 12
  console.log('Data extraite :', updateDto); // Devrait afficher: { name: 'tota' }

  if (!id) {
    throw new RpcException("L'ID de l'utilisateur est manquant dans le payload");
  }

  // 2. Recherche en base de données
  const doesUserExist = await this.UserRepository.findOne({
    where: { id: Number(id) },
  });

  if (!doesUserExist) {
    throw new RpcException("L'utilisateur n'existe pas en base de données");
  } 

  // 3. Fusion et sauvegarde
  const updateUser = this.UserRepository.merge(doesUserExist, updateDto);
  return await this.UserRepository.save(updateUser);
}

  @MessagePattern('Add_user')
  async add(CreateUserDto: CreateUserDto): Promise<UserEntity> {
    const doesUserExist = await this.UserRepository.findOne({
      where: { email: CreateUserDto.email },
    });

    if (doesUserExist) {
      throw new Error("L'email est déja utilisé");
    }

    const newUser = this.UserRepository.create(CreateUserDto);
    return await this.UserRepository.save(newUser);
  }

  @MessagePattern('Destroy_user')
  destroy(id: number) {
    return this.UserRepository.delete({ id });
  }
}
