import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import { initialize, use } from 'passport';
import { NOT_FOUND } from 'http-status';
import { env } from './config/config';
import morganError from './config/morgan';
import passportJwt from './config/passport';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes/v1';
import error from './middlewares/error';
import ApiError from './utils/ApiError';

const app = express();

if (env !== 'test') {
  app.use(morganError.successHandler);
  app.use(morganError.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(json());

// parse urlencoded request body
app.use(urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(initialize());
use('jwt', passportJwt.jwtStrategy);

// limit repeated failed requests to auth endpoints
if (env === 'production') {
  app.use('/v1/auth', rateLimiter.authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(error.errorConverter);

// handle error
app.use(error.errorHandler);

export default app;
