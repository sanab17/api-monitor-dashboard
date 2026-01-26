import request from 'supertest';
import app from '../src/server';

describe('Health Check', () => {
    it('should return health status', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Active');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('status');
    });

    afterAll(() => {
        jest.clearAllTimers();
    });
});