const request = require('supertest');
const app = require('../index');
const { setupDB } = require('./setup/test-setup');

setupDB();

describe('POST Endpoint: Login', () => {
    describe('Successful login attempts', () => {
        it('should login with all params', async (done) => {
            const signup = await request(app)
                .post('/signup')
                .send({
                    email: "test@somedomain.end",
                    password: "s0m3Rand0mP@ssw0rd",
                    firstname: "John",
                    lastname: "Doe",
                    phone: "9876543210",
                    address: "Some random address street name, building name, locality, city, state."
                });
            expect(signup.status).toBe(201);
            const login = await request(app)
                .post('/login')
                .send({
                    email: "test@somedomain.end",
                    password: "s0m3Rand0mP@ssw0rd",
                });
            expect(login.status).toBe(200);
            done();
        });

        describe('Unsuccessful login attempts', () => {
            it('should not login with wrong email', async (done) => {
                const signup = await request(app)
                    .post('/signup')
                    .send({
                        email: "test@somedomain.end",
                        password: "s0m3Rand0mP@ssw0rd",
                        firstname: "John",
                        lastname: "Doe",
                        phone: "9876543210",
                        address: "Some random address street name, building name, locality, city, state."
                    });
                expect(signup.status).toBe(201);
                const login = await request(app)
                    .post('/login')
                    .send({
                        email: "newtest@somedomain.end",
                        password: "s0m3Rand0mP@ssw0rd",
                    });
                expect(login.status).toBe(401);
                done();
            });

            it('should not login with wrong password', async (done) => {
                const signup = await request(app)
                    .post('/signup')
                    .send({
                        email: "test@somedomain.end",
                        password: "s0m3Rand0mP@ssw0rd",
                        firstname: "John",
                        lastname: "Doe",
                        phone: "9876543210",
                        address: "Some random address street name, building name, locality, city, state."
                    });
                expect(signup.status).toBe(201);
                const login = await request(app)
                    .post('/login')
                    .send({
                        email: "test@somedomain.end",
                        password: "wrongs0m3Rand0mP@ssw0rd",
                    });
                expect(login.status).toBe(401);
                done();
            });

            it('should not login with email missing', async (done) => {
                const signup = await request(app)
                    .post('/signup')
                    .send({
                        email: "test@somedomain.end",
                        password: "s0m3Rand0mP@ssw0rd",
                        firstname: "John",
                        lastname: "Doe",
                        phone: "9876543210",
                        address: "Some random address street name, building name, locality, city, state."
                    });
                expect(signup.status).toBe(201);
                const login = await request(app)
                    .post('/login')
                    .send({
                        email: null,
                        password: "s0m3Rand0mP@ssw0rd",
                    });
                expect(login.status).toBe(500);
                done();
            });

            it('should not login with password missing', async (done) => {
                const signup = await request(app)
                    .post('/signup')
                    .send({
                        email: "test@somedomain.end",
                        password: "s0m3Rand0mP@ssw0rd",
                        firstname: "John",
                        lastname: "Doe",
                        phone: "9876543210",
                        address: "Some random address street name, building name, locality, city, state."
                    });
                expect(signup.status).toBe(201);
                const login = await request(app)
                    .post('/login')
                    .send({
                        email: "test@somedomain.end",
                        password: null,
                    });
                expect(login.status).toBe(500);
                done();
            });
        });

    });
});
