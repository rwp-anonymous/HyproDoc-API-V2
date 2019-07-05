import { IsNotEmpty, IsEmail, IsString } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class SignInCredentialsDto {
    @ApiModelProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}