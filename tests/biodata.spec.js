const request = require("supertest");
const { app, server } = require("../index");
const { UserBiodata } = require("../models");

const newUserBiodata = {
  name: "Zaky",
  city: "Jakarta",
  address: "Jalan Sudirman",
  phone_number: "083934237583",
};

let testUserToken;

beforeAll(async () => {
  try {
  } catch (error) {
    console.log("Error : ", error);
  }
});

afterAll(async () => {
  try {
    await UserBiodata.destroy({ where: {} });
    server.close();
  } catch (error) {
    console.log("Error : ", error);
  }
});

describe("Update Biodata", () => {
  test("200 success", async () => {
    await request(app)
      .put("/biodata/" + newUserBiodata.id)
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
    const originalFn = UserBiodata.findAll;
    UserBiodata.findAll = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app).get("/biodata").expect(500);
    UserBiodata.findAll = originalFn;
  });
});
