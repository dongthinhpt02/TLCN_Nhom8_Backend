import { Test, TestingModule } from '@nestjs/testing';
import { LockingproductitemService } from './lockingproductitem.service';

describe('LockingproductitemService', () => {
  let service: LockingproductitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LockingproductitemService],
    }).compile();

    service = module.get<LockingproductitemService>(LockingproductitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
