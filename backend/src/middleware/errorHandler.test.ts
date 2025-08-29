
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { errorHandler } from './errorHandler';
import { ApiError, ValidationError } from '../types/api';

describe('errorHandler', () => {
  const req = {};
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
  const next = vi.fn();
  const consoleError = console.error;

  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = consoleError;
  });

  it('should handle ApiError', () => {
    const err = new ApiError('Bad Request', 400, 'VALIDATION_ERROR');
    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Bad Request',
      code: 'VALIDATION_ERROR',
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle ValidationError', () => {
    const err = new ValidationError('Validation failed');
    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle SyntaxError', () => {
    const err = new SyntaxError('Invalid JSON');
    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Invalid JSON format',
      code: 'INVALID_JSON',
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle SQLITE error in development', () => {
    const err = new Error('SQLITE_ERROR: table users has no column named email');
    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Database operation failed',
      code: 'DATABASE_ERROR',
      details: { originalMessage: err.message, stack: err.stack },
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle SQLITE error in production', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const err = new Error('SQLITE_ERROR: table users has no column named email');
    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Database operation failed',
      code: 'DATABASE_ERROR',
    });
    expect(next).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should handle generic Error in development', () => {
    const err = new Error('Something went wrong');
    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'An internal server error occurred',
      code: 'INTERNAL_SERVER_ERROR',
      details: { stack: err.stack },
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle generic Error in production', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const err = new Error('Something went wrong');
    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'An internal server error occurred',
      code: 'INTERNAL_SERVER_ERROR',
    });
    expect(next).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalNodeEnv;
  });
});
