import { Repository, EntityRepository } from "typeorm";
import { Item } from "./item.entity";
import { GetItemsFilterDto } from "./dto/get-items-filter.dto";
import { User } from "../auth/user.entity";
import { UserRoles } from "../auth/user-roles.enum";
import { UnauthorizedException, InternalServerErrorException, ConflictException } from "@nestjs/common";
import { CreateItemDto } from "./dto/create-item.dto";

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
    async getItems(
        filterDto: GetItemsFilterDto,
        user: User
    ): Promise<Item[]> {
        const { code, storeLocation } = filterDto;
        const query = this.createQueryBuilder('item');

        if (user.role === UserRoles.STORE_KEEPER || user.role === UserRoles.ADMIN) {
            if (code) {
                query.andWhere('(item.code LIKE :code)', { code: `%${code}%` });
            }

            if (storeLocation) {
                query.andWhere('(item.storeLocation LIKE :storeLocation)', { storeLocation: `%${storeLocation}%` });
            }

            try {
                const items = await query.getMany();
                return items;
            } catch (error) {
                throw new InternalServerErrorException();
            }
        } else {
            throw new UnauthorizedException();
        }
    }

    async createItem(
        createItemDto: CreateItemDto,
        user: User
    ): Promise<Item> {
        if (user.role === UserRoles.STORE_KEEPER || user.role === UserRoles.ADMIN) {
            const { code, description, quantity, supplier, threshold, unit, storeLocation } = createItemDto;

            const item = new Item();

            item.code = code;
            item.description = description;
            item.unit = unit;
            item.quantity = quantity;
            item.threshold = threshold;
            item.supplier = supplier;
            item.storeLocation = storeLocation;
            item.createdBy = user;

            try {
                await item.save();
            } catch (error) {
                if (error.code === '23505') {   // duplicate item
                    throw new ConflictException('Duplicate Item Code');
                } else {
                    throw new InternalServerErrorException();
                }
            }

            delete item.createdBy;

            return item;
        } else {
            throw new UnauthorizedException();
        }
    }
}