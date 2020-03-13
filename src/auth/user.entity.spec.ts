// import { User } from './user.entity';
// import * as bcrypt from 'bcrypt';

describe('UserEntity', () => {
  // mocking bcrypt not working

  // let user: User;
  // let bcrypt;

  // beforeEach(() => {
  //   user = new User();
  //   user.password = 'testPassword';
  //   user.salt = '$2b$10$Oj5wkD1k9QbPT/.uS5IzjO';

  //   bcrypt = new Object();
  //   bcrypt.hash = jest.fn();
  // })

  // describe('validatePassword', () => {
  //   it('returns true as password is valid', async () => {
  //     bcrypt.hash.mockResolvedValue('testPassword');
  //     expect(bcrypt.hash).not.toHaveBeenCalled();
  //     const result = await user.validatePassword('123456');
  //     expect(bcrypt.hash).toHaveBeenCalledWith('123456', user.salt);
  //     expect(result).toEqual(true);
  //   });

  //   it('returns false as password is invalid', async () => {
  //     bcrypt.hash.mockResolvedValue('wrongPassword');
  //     expect(bcrypt.hash).not.toHaveBeenCalled();
  //     const result = await user.validatePassword('wrongPassword');
  //     expect(bcrypt.hash).not.toHaveBeenCalledWith('wrongPassword', user.salt);
  //     expect(result).toEqual(false);
  //   });
  // });
})