import { IsString, MinLength, MaxLength, Matches, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { UserRoles } from "../user-roles.enum";
import { ApiModelProperty } from "@nestjs/swagger";

export class AuthCredentialsDto {
    @ApiModelProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiModelProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    firstName: string;

    @ApiModelProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    lastName: string;

    @ApiModelProperty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' }
    )
    password: string;

    @ApiModelProperty({ enum: UserRoles })
    @IsNotEmpty()
    role: UserRoles;

    @ApiModelProperty()
    @IsOptional()
    @IsString()
    avatarUrl: string;
}