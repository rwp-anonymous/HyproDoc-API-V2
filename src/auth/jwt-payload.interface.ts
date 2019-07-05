import { UserRoles } from "./user-roles.enum";

export interface JwtPayload {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRoles;
    avatarUrl: string;
}