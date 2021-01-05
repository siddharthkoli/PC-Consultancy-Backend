const request = require('supertest');
const app = require('../index');
const { setupDB } = require('./setup/test-setup');

setupDB();

describe('POST Endpoint: createTicket', () => {
    describe('Successful creation attempts', () => {
        it('should create entry in Tickets with all params', async (done) => {
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
            console.log(`token is ${signup.headers.jwt}`);
            expect(signup.status).toBe(201);
            const res = await request(app)
                .post('/createTicket')
                .set('Cookie', ['jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAc29tZWRvbWFpbi5lbmQiLCJwYXNzd29yZCI6InMwbTNSYW5kMG1QQHNzdzByZCIsImlhdCI6MTYwNTYwMTM1MywiZXhwIjoxNjA1ODYwNTUzfQ.oU7i1y9KsZ-v53DTPG82CSziagA5ur7I_PYUHyacGGc; Path=/; HttpOnly'])
                .send({
                    email: "test@somedomain.end",
                    issueType: "1",
                    issueDesc: "My PC doesn't seem to workn't. Please help."
                });
            expect(res.status).toBe(201);
            done();
        });
    });

    describe('Unsuccessful creation attempts', () => {
        it('should not create entry in Tickets with no signup', async (done) => {
            const res = await request(app)
                .post('/createTicket')
                .send({
                    email: "test@somedomain.end",
                    issueType: "1",
                    issueDesc: "My PC does't seem to workn't. Please help."
                });
            expect(res.status).toBe(500);
            done();
        });

        it('should not create entry in Tickets with no email', async (done) => {
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
            const res = await request(app)
                .post('/createTicket')
                .send({
                    email: null,
                    issueType: "1",
                    issueDesc: "My PC does't seem to workn't. Please help."
                });
            expect(res.status).toBe(500);
            done();
        });

        it('should not create entry in Tickets with wrong issueType', async (done) => {
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
            const res = await request(app)
                .post('/createTicket')
                .send({
                    email: "test@somedomain.end",
                    issueType: "10",
                    issueDesc: "My PC does't seem to workn't. Please help."
                });
            expect(res.status).toBe(500);
            done();
        });

        it('should not create entry in Tickets with no issueType', async (done) => {
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
            const res = await request(app)
                .post('/createTicket')
                .send({
                    email: "test@somedomain.end",
                    issueType: null,
                    issueDesc: "My PC does't seem to workn't. Please help."
                });
            expect(res.status).toBe(500);
            done();
        });

        it('should not create entry in Tickets with no issueDesc', async (done) => {
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
            const res = await request(app)
                .post('/createTicket')
                .send({
                    email: "test@somedomain.end",
                    issueType: "2",
                    issueDesc: null
                });
            expect(res.status).toBe(500);
            done();
        });
    });
});
