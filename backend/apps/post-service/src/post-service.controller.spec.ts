import { Test, TestingModule } from '@nestjs/testing';
import { PostServiceController } from './post-service.controller';
import { PostServiceService } from './post-service.service';

describe.skip('PostServiceController', () => {
  let postServiceController: PostServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostServiceController],
      providers: [PostServiceService],
    }).compile();

    postServiceController = app.get<PostServiceController>(
      PostServiceController,
    );
  });

  describe.skip('', () => {
    it('', () => {});
  });
});
