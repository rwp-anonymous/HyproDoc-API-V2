import { IsString, MinLength, MaxLength, Matches, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { UserRoles } from "../user-roles.enum";

export class AuthCredentialsDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    firstName: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    lastName: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' }
    )
    password: string;

    @IsNotEmpty()
    role: UserRoles;

    @IsOptional()
    @IsString()
    avatarUrl: string;
}