import { Repository, EntityRepository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { SignInCredentialsDto } from "./dto/signin-credentials.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { email, firstName, lastName, password, role, avatarUrl } = authCredentialsDto;

        const salt = await bcrypt.genSalt();

        const user = new User();
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = await this.hashPassword(password, salt);
        user.role = role;
        user.avatarUrl = avatarUrl;

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {   // duplicate email
                throw new ConflictException('Email already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(signInCredentialsDto: SignInCredentialsDto): Promise<AuthCredentialsDto> {
        const { email, password } = signInCredentialsDto;
        const user = await this.findOne({ email });

        if (user && await user.validatePassword(password)) {
            return user;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}