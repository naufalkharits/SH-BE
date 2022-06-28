const request = require("supertest");
const { app } = require("../index");
const { UserBiodata, User } = require("../models");

let testuser;
beforeAll(async () => {
  await request(app)
    .post("/auth/register")
    .send({ name: "testuser", email: "a@gmail.com", password: "12345" });
  testuser = await User.findOne({ where: { email: "a@gmail.com" } });
});

afterAll(async () => {
  try {
    await User.destroy({ where: {} });
    server.close();
  } catch (error) {
    console.log("Error : ", error);
  }
});

describe("Get Biodata", () => {
  test("200 Success", async () => {
    await request(app).get(`/biodata/${testuser.id}`).expect(200);
  });
  test("400 Validation Failed", async () => {
    await request(app).get(`/biodata/abc`).expect(400);
  });
  test("404 User Not Found", async () => {
    await request(app).get(`/biodata/0`).expect(404);
  });
  test("500 System Error", async () => {
    const originalFn = UserBiodata.findOne;
    UserBiodata.findOne = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app).get(`/biodata/${testuser.id}`).expect(500);
    UserBiodata.findOne = originalFn;
  });
});
