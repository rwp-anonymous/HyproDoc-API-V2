import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemRepository } from './item.repository';

const mockItemRepository = () => ({

})

describe('ItemsService', () => {
    let itemsService;
    let itemRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ItemsService,
                { provide: ItemRepository, useFactory: mockItemRepository },
            ],
        }).compile();

        itemsService = await module.get<ItemsService>(ItemsService);
        itemRepository = await module.get<ItemRepository>(ItemRepository);
    });
});