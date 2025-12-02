const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Note = require('../models/Note');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Note.deleteMany({});
});

describe('Notes API', () => {
    it('POST /api/notes - should create a new note', async () => {
        const res = await request(app)
            .post('/api/notes')
            .send({
                title: 'Test Note',
                body: 'This is a test note',
                folder: 'Work'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Test Note');
    });

    it('GET /api/notes - should return a list of notes', async () => {
        await Note.create({ title: 'Note 1', body: 'Body 1' });
        await Note.create({ title: 'Note 2', body: 'Body 2' });

        const res = await request(app).get('/api/notes');

        expect(res.statusCode).toEqual(200);
        expect(res.body.notes.length).toBe(2);
    });
});
