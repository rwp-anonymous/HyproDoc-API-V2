import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { UserRolesValidationPipe } from './pipes/user-roles-validation.pipe';
import { UserRoles } from './user-roles.enum';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordCredentialsDto } from './dto/forgotpassword-credentials.dto';
import { ResetPasswordCredentialsDto } from './dto/resetpassword-credentials.dto';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Get('/verify')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    verify(
        @GetUser() user: User
    ): Promise<User> {
        return this.authService.verify(user);
    }

    @Get('/users')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    getUsers(): Promise<Object[]> {
        return this.authService.getUsers();
    }

    @Get('/users/:id')
    getItemById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<User> {
        return this.authService.getUserById(id);
    }

    @Post('/signup')
    signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
        @Body('role', UserRolesValidationPipe) role: UserRoles
    ): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(signInCredentialsDto);
    }

    @Post('/forgotpassword')
    forgotPassword(@Body(ValidationPipe) forgotPasswordCredentialsDto: ForgotPasswordCredentialsDto): Promise<void> {
        return this.authService.forgotPassword(forgotPasswordCredentialsDto);
    }

    @Post('/resetpassword')
    resetPassword(@Body(ValidationPipe) resetPasswordCredentialsDto: ResetPasswordCredentialsDto): Promise<void> {
        return this.authService.resetPassword(resetPasswordCredentialsDto);
    }
}
