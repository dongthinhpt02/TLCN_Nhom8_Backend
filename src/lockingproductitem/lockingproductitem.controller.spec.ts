import { Test, TestingModule } from '@nestjs/testing';
import { LockingproductitemController } from './lockingproductitem.controller';

describe('LockingproductitemController', () => {
  let controller: LockingproductitemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LockingproductitemController],
    }).compile();

    controller = module.get<LockingproductitemController>(LockingproductitemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
