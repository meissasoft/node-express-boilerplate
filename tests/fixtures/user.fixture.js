import { Types } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { name as _name, internet } from 'faker';
import userModel from '../../src/models/user.model';

const password = 'password1';
const salt = genSaltSync(8);
const hashedPassword = hashSync(password, salt);

const userOne = {
  _id: Types.ObjectId(),
  name: _name.findName(),
  email: internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  _id: Types.ObjectId(),
  name: _name.findName(),
  email: internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  _id: Types.ObjectId(),
  name: _name.findName(),
  email: internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  await userModel.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

export default {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
