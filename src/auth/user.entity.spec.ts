import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User entity', () => {
    let user: User;

    beforeEach(() => {
        user = new User();
        user.password = 'testPassword';
        bcrypt.compare = jest.fn();
    });

    describe('validatePassword', () => {
        it('returns true as password is valid', async () => {
            bcrypt.compare.mockReturnValue('testPassword');
            expect(bcrypt.compare).not.toHaveBeenCalled();
            const result = await user.validatePassword('123456');
            expect(bcrypt.compare).toHaveBeenCalled();
            expect(result).toEqual('testPassword');
        });

        it('returns false as password is invalid', async () => {
            bcrypt.compare.mockReturnValue('wrongPassword');
            expect(bcrypt.compare).not.toHaveBeenCalled();
            const result = await user.validatePassword('wrongPassword');
            expect(bcrypt.compare).toHaveBeenCalled();
            expect(result).toEqual('wrongPassword');
        });
    });
});