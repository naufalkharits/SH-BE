const request = require("supertest");
const { app, server } = require("../index");
const { UserBiodata, User } = require("../models");
const path = require("path");

jest.mock("../utils/picture.js");

const newUserBiodata = {
  name: "Zaky",
  province: "DI Yogyakarta",
  city: "Bantul",
  address: "Jalan Sudirman",
  phone_number: "0839424242424",
  picture: path.join(__dirname, "resources", "product.png"),
};

let testUser, testUserAccessToken;

beforeAll(async () => {
  const registerResponse = await request(app)
    .post("/auth/register")
    .send({ name: "testUser", email: "a@gmail.com", password: "12345" });

  testUser = await User.findOne({ where: { email: "a@gmail.com" } });
  testUserAccessToken = registerResponse.body.accessToken.token;
});

afterAll(async () => {
  await User.destroy({ where: {} });
  server.close();
});

describe("Update Biodata", () => {
  test("200 Success", async () => {
    await request(app)
      .put("/biodata")
      .set("Authorization", testUserAccessToken)
      .field("name", newUserBiodata.name)
      .field("province", newUserBiodata.province)
      .field("city", newUserBiodata.city)
      .field("address", newUserBiodata.address)
      .field("phone_number", newUserBiodata.phone_number)
      .attach("picture", newUserBiodata.picture)
      .expect(200);
  });

  test("400 Picture Validation Failed", async () => {
    await request(app)
      .put("/biodata")
      .set("Authorization", testUserAccessToken)
      .attach("picture", path.join(__dirname, "resources", "product.txt"))
      .expect(400);
  });

  test("500 System Error", async () => {
    const originalFn = UserBiodata.update;
    UserBiodata.update = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .put("/biodata")
      .set("Authorization", testUserAccessToken)
      .expect(500);
    UserBiodata.update = originalFn;
  });
});

describe("Get Biodata", () => {
  test("200 Success", async () => {
    await request(app).get(`/biodata/${testUser.id}`).expect(200);
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
    await request(app).get(`/biodata/${testUser.id}`).expect(500);
    UserBiodata.findOne = originalFn;
  });
});
