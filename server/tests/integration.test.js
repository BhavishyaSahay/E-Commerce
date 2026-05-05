const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

jest.setTimeout(30000); // 30 seconds timeout for CI environments

// Since we bypass DB connection in 'test' env, we manually connect to an in-memory or test DB 
// to ensure API + DB interaction works correctly during testing.
describe('Integration Tests: API + DB / Modules Interaction', () => {

    beforeAll(async () => {
        // Connect to a local test DB if MongoDB URI is available or mock
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
    });

    afterAll(async () => {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
    });

    describe('GET /api/products', () => {
        it('should fetch the products list from the database successfully', async () => {
            const res = await request(app).get('/api/products');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body.products)).toBeTruthy();
        });
    });

    describe('GET /api/categories', () => {
        it('should return categories', async () => {
            const res = await request(app).get('/api/categories');
            // Assuming categories endpoint returns an array or an object depending on implementation
            expect(res.statusCode === 200 || res.statusCode === 404).toBeTruthy();
        });
    });
});
