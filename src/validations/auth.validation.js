import { object, string } from 'joi';
import validations from './custom.validation';

const register = {
  body: object().keys({
    email: string().required().email(),
    password: string().required().custom(validations.password),
    name: string().required(),
  }),
};

const login = {
  body: object().keys({
    email: string().required(),
    password: string().required(),
  }),
};

const logout = {
  body: object().keys({
    refreshToken: string().required(),
  }),
};

const refreshTokens = {
  body: object().keys({
    refreshToken: string().required(),
  }),
};

const forgotPassword = {
  body: object().keys({
    email: string().email().required(),
  }),
};

const resetPassword = {
  query: object().keys({
    token: string().required(),
  }),
  body: object().keys({
    password: string().required().custom(validations.password),
  }),
};

const verifyEmail = {
  query: object().keys({
    token: string().required(),
  }),
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
