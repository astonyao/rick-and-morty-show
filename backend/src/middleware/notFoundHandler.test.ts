
import { describe, it, expect, vi } from 'vitest';
import { notFoundHandler } from './notFoundHandler';

describe('notFoundHandler', () => {
  it('should send a 404 response', () => {
    const req = {
      method: 'GET',
      path: '/test'
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    notFoundHandler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Route GET /test not found',
        code: 'ROUTE_NOT_FOUND'
      }
    });
  });
});
