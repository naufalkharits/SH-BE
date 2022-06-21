// const request = require("supertest");
// const { app, server } = require("../index");
// const { User } = require("../models");
// const { testUser } = require("./product.spec.js");

// let testUser;

// beforeAll(async () => {
//   testUser = await User.create({
//     email: "test123@gmail.com",
//     password: "test123",
//   });
// });

// afterAll(async () => {
//   await User.destroy({ where: {} });
//   server.close();
// });

// describe("Register", () => {
//   test("200 Success", async () => {
//     await request(app).post("/auth/register").send({ email: "test321@gmail.com", password: "123456" }).expect(200);
//   });

//   test("409 Email already exists", async () => {
//     await request(app).post("/auth/register").send({ email: "test321@gmail.com", password: "123456" }).expect(409);
//   });

//   test("400 Invalid Email", async () => {
//     await request(app).post("/auth/register").send({ email: "inibukanemail", password: "123456" }).expect(400);
//   });

//   test("500 Failed Create New User", async () => {
//     User.create = jest.fn().mockImplementationOnce(() => {
//       throw new Error();
//     });
//     await request(app).post("/auth/register").send({ email: "test3210@gmail.com", password: "123456" }).expect(500);
//   });
// });
