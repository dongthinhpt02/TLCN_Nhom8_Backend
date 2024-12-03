import { Test, TestingModule } from '@nestjs/testing';
import { ProductitemService } from './productitem.service';

describe('ProductitemService', () => {
  let service: ProductitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductitemService],
    }).compile();

    service = module.get<ProductitemService>(ProductitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
