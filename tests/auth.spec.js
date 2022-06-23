const request = require("supertest");
const { app, server } = require("../index");
const { User } = require("../models");

let userAccessToken;
let userRefreshToken;

afterAll(async () => {
  await User.destroy({ where: {} });
  server.close();
});

describe("Register", () => {
  test("200 Success", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "test321@gmail.com", password: "123456" })
      .expect(200);
  });

  test("409 Email already exists", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "test321@gmail.com", password: "123456" })
      .expect(409);
  });

  test("400 Invalid Email", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "inibukanemail", password: "123456" })
      .expect(400);
  });

  test("500 Failed Create New User", async () => {
    const originalFn = User.create;
    User.create = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .post("/auth/register")
      .send({ email: "test3210@gmail.com", password: "123456" })
      .expect(500);
    User.create = originalFn;
  });
});

describe("Login", () => {
  test("200 Success", async () => {
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({ email: "test321@gmail.com", password: "123456" })
      .expect(200);

    userAccessToken = loginResponse.body.accessToken;
    userRefreshToken = loginResponse.body.refreshToken;
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email: "inibukanemail" })
      .expect(400);
  });

  test("400 Wrong Password", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email: "test321@gmail.com", password: "wrong" })
      .expect(400);
  });

  test("500 system error / unexpected error", async () => {
    const originalFn = User.findOne;
    User.findOne = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .post("/auth/login")
      .send({ email: "test321@gmail.com", password: "123456" })
      .expect(500);
    User.findOne = originalFn;
  });
});

describe("Me", () => {
  test("200 Success", async () => {
    await request(app)
      .get("/auth/me")
      .set("Authorization", userAccessToken)
      .expect(200);
  });
});

describe("Refresh Token", () => {
  test("200 Success", async () => {
    await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: userRefreshToken })
      .expect(200);
  });
  test("400 Validation Failed", async () => {
    await request(app).post("/auth/refresh").expect(400);
  });
  test("401 Unauthorized", async () => {
    await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: "abc" })
      .expect(401);
  });
});
