const request = require("supertest");
const { app, server } = require("../index");
const { Notification, User, Product } = require("../models");
const bcrypt = require("bcrypt");

let testNotification, testUserAccessToken;

beforeAll(async () => {
  const testUser = await User.create({
    email: "test@gmail.com",
    password: await bcrypt.hash("123456", 10),
  });
  const testProduct = await Product.create({
    name: "New Test Product",
    price: 50000,
    category_id: 3,
    description: "This is new test product",
    seller_id: testUser.id,
  });
  testNotification = await Notification.create({
    type: "NEW_PRODUCT",
    user_id: testUser.id,
    product_id: testProduct.id,
    read: false,
  });

  const loginResponse = await request(app).post("/auth/login").send({
    email: "test@gmail.com",
    password: "123456",
  });
  testUserAccessToken = loginResponse.body.accessToken.token;
});

afterAll(async () => {
  try {
    await User.destroy({ where: {} });
    await Notification.destroy({ where: {} });
    server.close();
  } catch (error) {
    console.log(error);
  }
});

describe("Get Notifications", () => {
  test("200 Success", async () => {
    await request(app)
      .get("/notification")
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });
  test("500 System Error", async () => {
    const originalFn = Notification.findAll;
    Notification.findAll = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .get("/notification")
      .set("Authorization", testUserAccessToken)
      .expect(500);
    Notification.findAll = originalFn;
  });
});

describe("Update Notification", () => {
  test("200 Success", async () => {
    await request(app)
      .put(`/notification/${testNotification.id}`)
      .set("Authorization", testUserAccessToken)
      .send({ read: true })
      .expect(200);
  });

  test("400 Validation Invalid Notification ID", async () => {
    await request(app)
      .put("/notification/abc")
      .set("Authorization", testUserAccessToken)
      .send({ read: true })
      .expect(400);
  });

  test("400 Validation Invalid Read Value", async () => {
    await request(app)
      .put(`/notification/${testNotification.id}`)
      .set("Authorization", testUserAccessToken)
      .send({ read: "abc" })
      .expect(400);
  });

  test("404 Notification Not Found", async () => {
    await request(app)
      .put("/notification/0")
      .set("Authorization", testUserAccessToken)
      .send({ read: true })
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Notification.update;
    Notification.update = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .put(`/notification/${testNotification.id}`)
      .set("Authorization", testUserAccessToken)
      .send({ read: true })
      .expect(500);
    Notification.update = originalFn;
  });
});

describe("Delete Notification", () => {
  test("200 Success", async () => {
    await request(app)
      .delete("/notification/" + testNotification.id)
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .delete("/notification/abc")
      .set("Authorization", testUserAccessToken)
      .expect(400);
  });

  test("404 Notification Not Found", async () => {
    await request(app)
      .delete("/notification/0")
      .set("Authorization", testUserAccessToken)
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Notification.destroy;
    Notification.destroy = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .delete("/notification/" + testNotification.id)
      .set("Authorization", testUserAccessToken)
      .expect(500);
    Notification.destroy = originalFn;
  });
});
