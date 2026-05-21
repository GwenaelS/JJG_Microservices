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
import  { CreatePostDto } from '@app/shared';
import { UpdatePostDto } from '@app/shared';

@Controller('/posts')
export class PostGatewayController {
  constructor(
    @Inject('POST_SERVICE') private readonly postClient: ClientProxy,
  ) {}

  /**
   * BROWSE (Obtenir tous les articles)
   * Route HTTP: GET /posts
   */
  @Get()
  browsePost() {
    return this.postClient.send('Browse_post', {});
  }

  /**
   * READ (Obtenir tous les articless)
   * Route HTTP: GET /users/:id
   */
  @Get('/:id')
  readPost(@Param('id') id: string) {
    return this.postClient.send('Read_post', id);
  }

  /**
   * EDIT (Obtenir tous les articles)
   * Route HTTP: GET /users/:id
   */
  @Patch('/:id') 
    async updatePost(
      @Param('id') id: number, 
      @Body() updatePostDto: UpdatePostDto 
    ) {
      return this.postClient.send('Edit_user', { 
        id: Number(id), 
        updateDto: updatePostDto 
      });
    }

  /**
   * ADD (Obtenir tous les articles)
   * Route HTTP: GET /users
   */
  @Post()
  addPost(@Body() CreatePostDto: CreatePostDto) {
    return this.postClient.send('Add_post', CreatePostDto);
  }

  /**
   * DESTROY (Obtenir tous les articles)
   * Route HTTP: GET /users/:id
   */
  @Delete('/:id')
  destroyPost(@Param('id') id: string) {
    return this.postClient.send('Destroy_post', id);
  }
}
