import { PipeTransform, BadRequestException } from "@nestjs/common";
import { UserRoles } from "../user-roles.enum";

export class UserRolesValidationPipe implements PipeTransform {
    readonly allowedRoles = [
        UserRoles.ADMIN,
        UserRoles.CEO,
        UserRoles.PROJECT_MANAGER,
        UserRoles.SITE_ENGINEER,
        UserRoles.PROCUREMENT_OFFICER,
        UserRoles.STORE_KEEPER,
        UserRoles.FOREMAN,
        UserRoles.MEDICAL_OFFICER,
    ];

    transform(value: any) {
        if (value) {
            value = value.toUpperCase();

            if (!this.isRoleValid(value)) {
                throw new BadRequestException(`${value} is an invalid role`)
            }

            return value;
        }
    }

    private isRoleValid(role: any) {
        const idx = this.allowedRoles.indexOf(role);
        return idx !== -1;
    }
}