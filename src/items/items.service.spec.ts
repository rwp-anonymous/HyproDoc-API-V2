import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemRepository } from './item.repository';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { StoreLocations } from './store-location.enum';
import { ItemUnits } from './item-units.enum';
import { UserRoles } from '../auth/user-roles.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 12, email: 'test@test.com', role: UserRoles.ADMIN };

const mockItemRepository = () => ({
    getItems: jest.fn(),
    findOne: jest.fn(),
    createItem: jest.fn(),
    delete: jest.fn(),
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

    describe('getItemById', () => {
        it('calls itemRepository.findOne() and successfully retrive and return the task', async () => {
            const mockTask = {
                code: 'Test Code',
                description: 'Test Description',
                unit: ItemUnits.KG,
                quantity: 10,
                threshold: 2,
                storeLocation: StoreLocations.UGANDA,
                supplier: 'Test Supplier'
            };

            itemRepository.findOne.mockResolvedValue(mockTask);

            const result = await itemsService.getItemById(1, mockUser);
            expect(result).toEqual(mockTask);

        });

        it('throws an error as task is not found', () => {
            itemRepository.findOne.mockResolvedValue(null);
            expect(itemsService.getItemById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createItem', () => {
        it('calls itemRepository.create() and returns the result', async () => {
            itemRepository.createItem.mockResolvedValue('someItem');

            expect(itemRepository.createItem).not.toHaveBeenCalled();
            const createTaskDto = {
                code: 'Test Code',
                description: 'Test Description',
                unit: 'KG',
                quantity: 100,
                threshold: 10,
                storeLocation: 'UGANDA',
                supplier: 'Test Supplier'
            }
            const result = await itemsService.createItem(createTaskDto, mockUser);
            expect(itemRepository.createItem).toHaveBeenCalledWith(createTaskDto, mockUser);
            expect(result).toEqual('someItem');
        });
    });

    describe('deleteItem', () => {
        it('calls itemRepository.deleteItem() to delete a item', async () => {
            itemRepository.delete.mockResolvedValue({ affected: 1 });
            expect(itemRepository.delete).not.toHaveBeenCalled();
            await itemsService.deleteItem(1, mockUser);
            expect(itemRepository.delete).toHaveBeenCalled();
        });
    });

    it('throws an error as item could not be found', () => {
        itemRepository.delete.mockResolvedValue({ affected: 0 });
        expect(itemsService.deleteItem(1, mockUser)).rejects.toThrow(NotFoundException);
    });
});
