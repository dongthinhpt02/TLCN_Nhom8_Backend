import { Test, TestingModule } from '@nestjs/testing';
import { ProductitemController } from './productitem.controller';

describe('ProductitemController', () => {
  let controller: ProductitemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductitemController],
    }).compile();

    controller = module.get<ProductitemController>(ProductitemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
