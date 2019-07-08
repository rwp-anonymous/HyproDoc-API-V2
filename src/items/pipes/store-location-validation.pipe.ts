import { PipeTransform, BadRequestException } from "@nestjs/common";
import { StoreLocations } from "../store-location.enum";

export class StoreLocationValidationPipe implements PipeTransform {
    readonly allowedStoreLocation = [
        StoreLocations.UGANDA,
        StoreLocations.SRI_LANKA,
    ];

    transform(value: any) {
        value = value.toUpperCase();

        if (!this.isStoreLocationValid(value)) {
            throw new BadRequestException(`${value} is an invalid store location`)
        }

        return value;
    }

    private isStoreLocationValid(storeLocation: any) {
        const idx = this.allowedStoreLocation.indexOf(storeLocation);
        return idx !== -1;
    }
}