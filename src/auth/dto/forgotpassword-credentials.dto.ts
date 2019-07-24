import { IsNotEmpty, IsEmail } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class ForgotPasswordCredentialsDto {
    @ApiModelProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}