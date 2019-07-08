import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemRepository } from './item.repository';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { User } from '../auth/user.entity';
import { Item } from './item.entity';
import { UserRoles } from '../auth/user-roles.enum';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(ItemRepository)
        private itemRepository: ItemRepository
    ) { }

    async getItems(
        filterDto: GetItemsFilterDto,
        user: User
    ): Promise<Item[]> {
        return this.itemRepository.getItems(filterDto, user);
    }

    async getItemById(
        id: number,
        user: User
    ): Promise<Item> {
        let found;

        if (user.role === UserRoles.ADMIN || user.role === UserRoles.STORE_KEEPER) {
            found = await this.itemRepository.findOne(id);
        }

        if (!found) {
            throw new NotFoundException(`Item with ID ${id} not found`);
        }

        return found;
    }

    async createItem(
        createItemDto: CreateItemDto,
        user: User
    ): Promise<Item> {
        return this.itemRepository.createItem(createItemDto, user);
    }

    async deleteItem(id: number, user: User): Promise<void> {
        let result;
        if (user.role === UserRoles.ADMIN) {
            result = await this.itemRepository.delete(id);
        } else {
            throw new NotFoundException(`Item with ID ${id} not found`);
        }

        if (result && result.affected === 0) {
            throw new NotFoundException(`Item with ID ${id} not found`);
        }
    }

    async updateItemQuantity(id: number, quantity: number, user: User): Promise<Item> {
        const item = await this.getItemById(id, user);

        if (quantity < item.threshold) {
            throw new BadRequestException(`Item quntity cannot exceed threshold`);
        }
        item.quantity = quantity;

        await item.save();

        return item;
    }
}
