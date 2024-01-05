import { describe, expect, test } from '@jest/globals';
import * as request from 'supertest';
import app from '../src/app';

describe('Test the root path', () => {
  test('Should have success status code', () => {
    return request(app)
      .get('/')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});
