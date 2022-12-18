const request = require("supertest");
const { app, server } = require("../index");
const { Notification, User, Product, Transaction } = require("../models");
const bcrypt = require("bcrypt");

let testNotification, testUserAccessToken, testUser2AccessToken;

beforeAll(async () => {
  const testUser = await User.create({
    email: "test@gmail.com",
    password: await bcrypt.hash("123456", 10),
  });
  const testUser2 = await User.create({
    email: "test2@gmail.com",
    password: await bcrypt.hash("123456", 10),
  });
  const testProduct = await Product.create({
    name: "New Test Product",
    price: 50000,
    category_id: 3,
    description: "This is new test product",
    weight: 100,
    seller_id: testUser.id,
  });
  testNotification = await Notification.create({
    type: "NEW_PRODUCT",
    user_id: testUser.id,
    product_id: testProduct.id,
    read: false,
  });

  const testTransaction = await Transaction.create({
    product_id: testProduct.id,
    buyer_id: testUser.id,
    price: 50000,
    status: "PENDING",
  });
  const testNewTransactionNotification = await Notification.create({
    type: "NEW_OFFER",
    user_id: testUser.id,
    transaction_id: testTransaction.id,
    read: false,
  });
  const testTransactionCompleteNotification = await Notification.create({
    type: "TRANSACTION_COMPLETED",
    user_id: testUser.id,
    transaction_id: testTransaction.id,
    read: false,
  });
  const testTransactionRejectedNotification = await Notification.create({
    type: "TRANSACTION_REJECTED",
    user_id: testUser.id,
    transaction_id: testTransaction.id,
    read: false,
  });
  const testTransactionAcceptedNotification = await Notification.create({
    type: "TRANSACTION_ACCEPTED",
    user_id: testUser.id,
    transaction_id: testTransaction.id,
    read: false,
  });

  const loginResponse = await request(app).post("/auth/login").send({
    email: "test@gmail.com",
    password: "123456",
  });
  const loginResponse2 = await request(app).post("/auth/login").send({
    email: "test2@gmail.com",
    password: "123456",
  });
  testUserAccessToken = loginResponse.body.accessToken.token;
  testUser2AccessToken = loginResponse2.body.accessToken.token;
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await Notification.destroy({ where: {} });
  server.close();
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

describe("Read All Notification", () => {
  test("200 Success", async () => {
    await request(app)
      .put("/notification/")
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("500 System Error", async () => {
    const originalFn = Notification.update;
    Notification.update = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .put(`/notification/`)
      .set("Authorization", testUserAccessToken)
      .expect(500);
    Notification.update = originalFn;
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

  test("401 Unauthorized", async () => {
    await request(app)
      .put(`/notification/${testNotification.id}`)
      .set("Authorization", testUser2AccessToken)
      .send({ read: true })
      .expect(401);
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
  test("401 Unauthorized", async () => {
    await request(app)
      .delete("/notification/" + testNotification.id)
      .set("Authorization", testUser2AccessToken)
      .expect(401);
  });

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
