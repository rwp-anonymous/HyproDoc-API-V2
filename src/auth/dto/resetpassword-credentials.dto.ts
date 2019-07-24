import { IsString, MinLength, MaxLength, Matches, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class ResetPasswordCredentialsDto {
    @ApiModelProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiModelProperty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' }
    )
    password: string;
}