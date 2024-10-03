const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Jobs = require("../models/jobModel");

let token = null;

beforeAll(async () => {
    await Jobs.deleteMany({});
    const result = await api.post("/api/users/signup").send({
        name: "John Doe",
        username: "john@example.com",
        password: "password123",
        phone_number: "1234567890",
        gender: "Male",
        date_of_birth: "1990-01-01",
        membership_status: "Inactive",
        address: "address",
    });
    token = result.body.token;
});

describe("Job API", function () {
    beforeEach(async () => {
        await Jobs.deleteMany({});

        job = {
            title: "John Doe",
            type: "Full-time",
            description: "password123",
            company: {
                name: "name",
                contactEmail: "Male@example.com",
                contactPhone: "19900101",
            },
            location: "Inactive",
            salary: "255423",
        }

        const result = await api
            .post("/api/jobs")
            .send(job)
            .set("Authorization", "bearer " + token)
    });

    describe("GET /jobs", () => {
        it('should return all jobs', async () => {
            await api
                .get("/api/jobs")
                .set("Authorization", "bearer " + token)
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        it('should get one job by id', async () => {
            console.log("entered test")

            const job = await Jobs.findOne();

            console.log(job)

            await api
                .get("/api/jobs/" + job._id)
                .set("Authorization", "bearer " + token)
                .expect(200)
                .expect("Content-Type", /application\/json/);
        })
    })

    describe("POST /jobs", () => {
        it('should create a new job', async () => {
            console.log("entered test")

            const newJob = {
                title: "job",
                type: "Full-time",
                description: "description",
                company: {
                    name: "name",
                    contactEmail: "email@email.email",
                    contactPhone: "1234567",
                },
                location: "location",
                salary: 1234567,
            };

            const response = await api
                .post("/api/jobs")
                .set("Authorization", "bearer " + token)
                .send(newJob)
                .expect(201)
                .expect("Content-Type", /application\/json/);
        });
    });

    describe("PUT /jobs", () => {
        it('should update job by id', async () => {
            const job = await Jobs.findOne();
            const updatedJob = {
                type: "Lmao",
                description: "Bad",
            };

            const response = await api
                .put(`/api/jobs/${job._id}`)
                .set("Authorization", "bearer " + token)
                .send(updatedJob)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            console.log("Response body:", response.body);

            const updatedjobCheck = await Jobs.findById(job._id);
            console.log("Updated job:", updatedjobCheck);

            expect(updatedjobCheck.type).toBe(updatedJob.type);
            expect(updatedjobCheck.description).toBe(updatedJob.description);
        })
    })

    describe("Delete /jobs", () => {
        it('should delete job by id', async () => {
            const job = await Jobs.findOne();
            await api
                .delete(`/api/jobs/${job._id}`)
                .set("Authorization", "bearer " + token)
                .expect(204)
            const jobCheck = await Jobs.findById(job._id);
            expect(jobCheck).toBeNull();
        })
    })
})