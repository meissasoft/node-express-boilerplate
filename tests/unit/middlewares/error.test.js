import { Error as _Error } from 'mongoose';
import httpStatus, { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
import { createRequest, createResponse } from 'node-mocks-http';
import { errorConverter, errorHandler } from '../../../src/middlewares/error';
import ApiError from '../../../src/utils/ApiError';
import { env } from '../../../src/config/config';
import logger from '../../../src/config/logger';

describe('Error middlewares', () => {
  describe('Error converter', () => {
    test('should return the same ApiError object it was called with', () => {
      const error = new ApiError(BAD_REQUEST, 'Any error');
      const next = jest.fn();

      errorConverter(error, createRequest(), createResponse(), next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test('should convert an Error to ApiError and preserve its status and message', () => {
      const error = new Error('Any error');
      error.statusCode = BAD_REQUEST;
      const next = jest.fn();

      errorConverter(error, createRequest(), createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: error.statusCode,
          message: error.message,
          isOperational: false,
        })
      );
    });

    test('should convert an Error without status to ApiError with status 500', () => {
      const error = new Error('Any error');
      const next = jest.fn();

      errorConverter(error, createRequest(), createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: INTERNAL_SERVER_ERROR,
          message: error.message,
          isOperational: false,
        })
      );
    });

    test('should convert an Error without message to ApiError with default message of that http status', () => {
      const error = new Error();
      error.statusCode = BAD_REQUEST;
      const next = jest.fn();

      errorConverter(error, createRequest(), createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: error.statusCode,
          message: httpStatus[error.statusCode],
          isOperational: false,
        })
      );
    });

    test('should convert a Mongoose error to ApiError with status 400 and preserve its message', () => {
      const error = new _Error('Any mongoose error');
      const next = jest.fn();

      errorConverter(error, createRequest(), createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: BAD_REQUEST,
          message: error.message,
          isOperational: false,
        })
      );
    });

    test('should convert any other object to ApiError with status 500 and its message', () => {
      const error = {};
      const next = jest.fn();

      errorConverter(error, createRequest(), createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: INTERNAL_SERVER_ERROR,
          message: httpStatus[INTERNAL_SERVER_ERROR],
          isOperational: false,
        })
      );
    });
  });

  describe('Error handler', () => {
    beforeEach(() => {
      jest.spyOn(logger, 'error').mockImplementation(() => {});
    });

    test('should send proper error response and put the error message in res.locals', () => {
      const error = new ApiError(BAD_REQUEST, 'Any error');
      const res = createResponse();
      const sendSpy = jest.spyOn(res, 'send');

      errorHandler(error, createRequest(), res);

      expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining({ code: error.statusCode, message: error.message }));
      expect(res.locals.errorMessage).toBe(error.message);
    });

    test('should put the error stack in the response if in development mode', () => {
      env = 'development';
      const error = new ApiError(BAD_REQUEST, 'Any error');
      const res = createResponse();
      const sendSpy = jest.spyOn(res, 'send');

      errorHandler(error, createRequest(), res);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({ code: error.statusCode, message: error.message, stack: error.stack })
      );
      env = process.env.NODE_ENV;
    });

    test('should send internal server error status and message if in production mode and error is not operational', () => {
      env = 'production';
      const error = new ApiError(BAD_REQUEST, 'Any error', false);
      const res = createResponse();
      const sendSpy = jest.spyOn(res, 'send');

      errorHandler(error, createRequest(), res);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: INTERNAL_SERVER_ERROR,
          message: httpStatus[INTERNAL_SERVER_ERROR],
        })
      );
      expect(res.locals.errorMessage).toBe(error.message);
      env = process.env.NODE_ENV;
    });

    test('should preserve original error status and message if in production mode and error is operational', () => {
      env = 'production';
      const error = new ApiError(BAD_REQUEST, 'Any error');
      const res = createResponse();
      const sendSpy = jest.spyOn(res, 'send');

      errorHandler(error, createRequest(), res);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: error.statusCode,
          message: error.message,
        })
      );
      env = process.env.NODE_ENV;
    });
  });
});
