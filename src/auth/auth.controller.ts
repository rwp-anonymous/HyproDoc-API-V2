import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { UserRolesValidationPipe } from './pipes/user-roles-validation.pipe';
import { UserRoles } from './user-roles.enum';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('/signup')
    signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
        @Body('role', UserRolesValidationPipe) role: UserRoles
    ): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }
}
