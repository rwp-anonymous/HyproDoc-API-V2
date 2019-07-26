import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SendGridService } from '@anchan828/nest-sendgrid';
import * as config from 'config';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { ForgotPasswordCredentialsDto } from './dto/forgotpassword-credentials.dto';
import { ResetPasswordCredentialsDto } from './dto/resetpassword-credentials.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,

        private jwtService: JwtService,
        private sendGridService: SendGridService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const user = await this.userRepository.signUp(authCredentialsDto);
        if (user) {
            this.sendResetPasswordEmail(user);
        }
    }

    async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string }> {
        const user = await this.userRepository.validateUserPassword(signInCredentialsDto);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatarUrl: user.avatarUrl
        };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }

    async verify(payload: JwtPayload): Promise<User> {
        const { email } = payload;
        const user = await this.userRepository.findOne({ email });

        if (!user) {
            throw new UnauthorizedException();
        }

        delete user.password;

        return user;
    }

    async getUsers(): Promise<Object[]> {
        const users = await this.userRepository.find();

        const newUsers = users.map(({ password, ...rest }) => rest);

        return newUsers;
    }

    async getUserById(
        id: number
    ): Promise<User> {
        let found;

        found = await this.userRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`User with ID ${id} not found`);
        } else {
            delete found.password;
        }

        return found;
    }

    async forgotPassword(forgotPasswordCredentialsDto: ForgotPasswordCredentialsDto): Promise<void> {
        const { email } = forgotPasswordCredentialsDto;

        const user = await this.userRepository.findOne({ email });

        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        this.sendResetPasswordEmail(user);

        // const token = this.jwtService.sign(
        //     {
        //         email: user.email,
        //         firstName: user.firstName,
        //         lastName: user.lastName,
        //         role: user.role,
        //         avatarUrl: user.avatarUrl
        //     }
        // );

        // const resetPasswordUrl = 'http://localhost:4200/resetpassword/' + token;
        // const baseUrl = 'http://localhost:4200';

        // await this.sendGridService.send({
        //     to: email,
        //     from: "HyproDoc No-Reply <noreply@hyprodoc.com>",
        //     subject: "Reset Password",
        //     html: `<p>Dear ${user.firstName}<p>` +
        //         `<p>To reset your HyproDoc password, you will need to create a new password by clicking here: ` +
        //         `<a href=${resetPasswordUrl} target="_blank">password reset link</a>.</p>` +
        //         `<p>You will then be able to log in on the home page at <a href=${baseUrl}>${baseUrl}` +
        //         '</a> using your email adress as your username and the password that you select.</p>' +
        //         '<p><br/>Kind Regards,<br/>The HyproDoc Team</p>'
        // });
    }

    async resetPassword(resetPasswordCredentialsDto: ResetPasswordCredentialsDto): Promise<void> {
        return await this.userRepository.resetUserPassword(resetPasswordCredentialsDto);
    }

    private async sendResetPasswordEmail(user: User) {
        const baseUrl = config.get('api').baseUrl;

        const token = this.jwtService.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatarUrl: user.avatarUrl
            }
        );

        const resetPasswordUrl = `${baseUrl}/resetpassword/${token}`;

        await this.sendGridService.send({
            to: user.email,
            from: "HyproDoc No-Reply <noreply@hyprodoc.com>",
            subject: "Reset Password",
            html: `<p>Dear ${user.firstName}<p>` +
                `<p>To reset your HyproDoc password, you will need to create a new password by clicking here: ` +
                `<a href=${resetPasswordUrl} target="_blank">password reset link</a>.</p>` +
                `<p>You will then be able to log in on the home page at <a href=${baseUrl}>${baseUrl}` +
                '</a> using your email adress as your username and the password that you select.</p>' +
                '<p><br/>Kind Regards,<br/>The HyproDoc Team</p>'
        });
    }
}
