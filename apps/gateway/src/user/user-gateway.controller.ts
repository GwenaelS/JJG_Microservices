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

  /**
   * BROWSE (Obtenir tous les utilisateurs)
   * Route HTTP: GET /users
   */
  @Get()
  browseUser() {
    return this.userClient.send('Browse_user', {});
  }

  /**
   * READ (Obtenir tous les utilisateurs)
   * Route HTTP: GET /users/:id
   */
  @Get('/:id')
  readUser(@Param('id') id: string) {
    return this.userClient.send('Read_user', id);
  }

  /**
   * EDIT (Obtenir tous les utilisateurs)
   * Route HTTP: GET /users/:id
   */
  @Patch('/:id')
  editUser(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
    return this.userClient.send('Edit_user', UpdateUserDto);
  }

  /**
   * ADD (Obtenir tous les utilisateurs)
   * Route HTTP: GET /users
   */
  @Post()
  addUser(@Body() CreateUserDto: CreateUserDto) {
    return this.userClient.send('Add_user', CreateUserDto);
  }

  /**
   * DESTROY (Obtenir tous les utilisateurs)
   * Route HTTP: GET /users/:id
   */
  @Delete('/:id')
  destroyUser(@Param('id') id: string) {
    return this.userClient.send('Destroy_user', id);
  }
}
