import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ItemUnits } from "../item-units.enum";

export class ItemUnitValidationPipe implements PipeTransform {
    readonly allowedUnits = [
        ItemUnits.KG,
        ItemUnits.LB,
        ItemUnits.TONNE,
        ItemUnits.PC,
        ItemUnits.CREATE
    ];

    transform(value: any) {
        value = value.toUpperCase();

        if (!this.isUnitValid(value)) {
            throw new BadRequestException(`${value} is an invalid unit`)
        }

        return value;
    }

    private isUnitValid(unit: any) {
        const idx = this.allowedUnits.indexOf(unit);
        return idx !== -1;
    }
}