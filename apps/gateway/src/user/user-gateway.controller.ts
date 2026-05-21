import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '@app/shared';
import { UpdateUserDto } from '@app/shared';

@Controller('/users')
export class UserGatewayController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Get()
  browseUser() {
    return this.userClient.send('Browse_user', {});
  }

  @Get('/:id')
  readUser(@Param('id') id: string) {
    return this.userClient.send('Read_user', id);
  }

  // LA ROUTE CORRIGÉE ICI :
  @Patch('/:id') 
  async updateUser(
    @Param('id') id: number, 
    @Body() updateUserDto: UpdateUserDto 
  ) {
    return this.userClient.send('Edit_user', { 
      id: Number(id), 
      updateDto: updateUserDto 
    });
  }

  @Post()
  addUser(@Body() CreateUserDto: CreateUserDto) {
    return this.userClient.send('Add_user', CreateUserDto);
  }

  @Delete('/:id')
  destroyUser(@Param('id') id: string) {
    return this.userClient.send('Destroy_user', id);
  }
}