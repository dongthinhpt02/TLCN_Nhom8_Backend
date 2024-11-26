import { Test, TestingModule } from '@nestjs/testing';
import { ImagekitController } from './imagekit.controller';

describe('ImagekitController', () => {
  let controller: ImagekitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagekitController],
    }).compile();

    controller = module.get<ImagekitController>(ImagekitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
