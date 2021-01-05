const request = require('supertest');
const app = require('../index');
const { setupDB } = require('./setup/test-setup');

setupDB();

describe('POST endpoint: Signup', () => {
    describe('Successfull signup attempts', () => {
        it('should create entry Users with all params', async (done) => {
            const res = await request(app)
                .post('/signup')
                .send({
                    email: "test@somedomain.end",
                    password: "s0m3Rand0mP@ssw0rd",
                    firstname: "John",
                    lastname: "Doe",
                    phone: "9876543210",
                    address: "Some random address street name, building name, locality, city, state."
                })
            expect(res.status).toBe(201);
            done();
        });

        it('should create entry Users with lastname missing', async (done) => {
            const res = await request(app)
                .post('/signup')
                .send({
                    email: "test@somedomain.end",
                    password: "s0m3Rand0mP@ssw0rd",
                    firstname: "John",
                    lastname: null,
                    phone: "9876543210",
                    address: "Some random address street name, building name, locality, city, state."
                });
            expect(res.status).toBe(201);
            done();
        });

        it('should create entry Users with address and lastname missing', async (done) => {
            const res = await request(app)
                .post('/signup')
                .send({
                    email: "test@somedomain.end",
                    password: "s0m3Rand0mP@ssw0rd",
                    firstname: "John",
                    lastname: null,
                    phone: "9876543210",
                    address: null
                });
            expect(res.status).toBe(201);
            done();
        });
        
        it('should create entry Users with address missing', async (done) => {
            const res = await request(app)
                .post('/signup')
                .send({
                    email: "test@somedomain.end",
                    password: "s0m3Rand0mP@ssw0rd",
                    firstname: "John",
                    lastname: "Doe",
                    phone: "9876543210",
                    address: null
                });
            expect(res.status).toBe(201);
            done();
        });
    });

    describe('Unsuccessful signup attempts', () => {
        it('should not create entry in Users with email missing', async (done) => {
            const res = await request(app)
                .post('/signup')
                .send({
                    email: null,
                    password: "s0m3Rand0mP@ssw0rd",
                    firstname: "John",
                    lastname: "Doe",
                    phone: "9876543210",
                    address: "Some random address street name, building name, locality, city, state."
                });
            expect(res.status).toBe(500);
            done();
        });

        it('should not create entry in Users with password missing', async (done) => {
            const res = await request(app)
                .post('/signup')
                .send({
                    email: "test@somedomain.end",
                    password: null,
                    firstname: "John",
                    lastname: "Doe",
                    phone: "9876543210",
                    address: "Some random address street name, building name, locality, city, state."
                });
            expect(res.status).toBe(500);
            done();
        });

        it('should not create entry in Users with firstname missing', async (done) => {
            const res = await request(app)
                .post('/signup')
                .send({
                    email: "test@somedomain.end",
                    password: "s0m3Rand0mP@ssw0rd",
                    firstname: null,
                    lastname: "Doe",
                    phone: "9876543210",
                    address: "Some random address street name, building name, locality, city, state."
                });
            expect(res.status).toBe(500);
            done();
        });
    })

});
