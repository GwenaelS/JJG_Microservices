import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '@app/shared';
import { InjectRepository } from '@nestjs/typeorm';

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
  async edit(id: number, UpdateUserDto: UpdateUserDto): Promise<UserEntity> {

    const doesUserExist = await this.UserRepository.findOne({
      where : {id},
    });
    console.log(doesUserExist);
    if(!doesUserExist) {
      throw new Error("l'utilisateur n'existe pas");
    } 
    const updateUser = this.UserRepository.merge(doesUserExist, UpdateUserDto);
    console.log(updateUser);
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
