import { object, string, number, required } from 'joi';
// eslint-disable-next-line import/named
import { password, objectId } from './custom.validation';

const createUser = {
  body: object().keys({
    email: string().required().email(),
    password: string().required().custom(password),
    name: string().required(),
    role: string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: object().keys({
    name: string(),
    role: string(),
    sortBy: string(),
    limit: number().integer(),
    page: number().integer(),
  }),
};

const getUser = {
  params: object().keys({
    userId: string().custom(objectId),
  }),
};

const updateUser = {
  params: object().keys({
    userId: required().custom(objectId),
  }),
  body: object()
    .keys({
      email: string().email(),
      password: string().custom(password),
      name: string(),
    })
    .min(1),
};

const deleteUser = {
  params: object().keys({
    userId: string().custom(objectId),
  }),
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
