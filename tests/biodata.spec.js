const request = require("supertest");
const { app } = require("../index");
const { UserBiodata, User } = require("../models");

const newUserBiodata = {
  name: "Zaky",
  city: "Jakarta",
  address: "Jalan Sudirman",
  phone_number: "0839424242424",
};

let testUser;
beforeAll(async () => {
  await request(app).post("/auth/register").send({ name: "testUser", email: "a@gmail.com", password: "12345" });
  testUser = await User.findOne({ where: { email: "a@gmail.com" } });
});

afterAll(async () => {
  try {
    await User.destroy({ where: {} });
    server.close();
  } catch (error) {
    console.log("Error : ", error);
  }
});

describe("Update Biodata", () => {
  test("200 success", async () => {
    await request(app)
      .put("/biodata/" + testUser.id)
      .field("name", newUserBiodata.name)
      .field("city", newUserBiodata.city)
      .field("address", newUserBiodata.address)
      .field("phone_number", newUserBiodata.phone_number)
      .expect(200);
  });

  test("404 User Biodata Not Found", async () => {
    await request(app).put("/biodata/").field("name", newUserBiodata.name).field("city", newUserBiodata.city).field("address", newUserBiodata.address).field("phone_number", newUserBiodata.phone_number).expect(404);
  });

  test("400 Validation Failed", async () => {
    await request(app).put("/biodata/abc").field("name", newUserBiodata.name).field("city", newUserBiodata.city).field("address", newUserBiodata.address).field("phone_number", newUserBiodata.phone_number).expect(400);
  });

  test("500 System Error", async () => {
    const originalFn = UserBiodata.update;
    UserBiodata.update = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .put("/biodata/" + testUser.id)
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
