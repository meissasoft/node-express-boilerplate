import { config } from 'dotenv';
import { join } from 'path';
import { object, string, number } from 'joi';

config({ path: join(__dirname, '../../.env') });

const envVarsSchema = object()
  .keys({
    NODE_ENV: string().valid('production', 'development', 'test').required(),
    PORT: number().default(3000),
    MONGODB_URL: string().required().description('Mongo DB url'),
    JWT_SECRET: string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: number().default(10).description('minutes after which verify email token expires'),
    SMTP_HOST: string().description('server that will send the emails'),
    SMTP_PORT: number().description('port to connect to the email server'),
    SMTP_USERNAME: string().description('username for email server'),
    SMTP_PASSWORD: string().description('password for email server'),
    EMAIL_FROM: string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = envVars.NODE_ENV;
export const port = envVars.PORT;
export const mongoose = {
  url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
  options: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
export const jwt = {
  secret: envVars.JWT_SECRET,
  accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
};
export const email = {
  smtp: {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    auth: {
      user: envVars.SMTP_USERNAME,
      pass: envVars.SMTP_PASSWORD,
    },
  },
  from: envVars.EMAIL_FROM,
};
