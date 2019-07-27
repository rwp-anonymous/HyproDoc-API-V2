import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemRepository } from './item.repository';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { StoreLocations } from './store-location.enum';

const mockUser = { email: 'test@test.com' };

const mockItemRepository = () => ({
    getItems: jest.fn(),
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

    describe('getItems', () => {
        it('get all items from the repository', async () => {
            itemRepository.getItems.mockResolvedValue('someValue');

            expect(itemRepository.getItems).not.toHaveBeenCalled();

            const filters: GetItemsFilterDto = { storeLocation: StoreLocations.UGANDA, code: 'some code query' };

            const result = await itemsService.getItems(filters, mockUser);
            expect(itemRepository.getItems).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });
});