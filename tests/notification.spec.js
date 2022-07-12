const request = require("supertest");
const { app, server } = require("../index");
const { Notification, User } = require("../models");

let testNotification;

beforeAll(async () => {
  const testUser = await User.create({
    email: "test@gmail.com",
    password: "123456",
  });
  testNotification = await Notification.create({
    type: "TEST_NOTIFICATION",
    user_id: testUser.id,
    read: false,
  });
});

afterAll(async () => {
  server.close();
});

describe("Get Notifications", () => {
  test("200 Success", async () => {
    await request(app).get("/notification").expect(200);
  });
  test("500 System Error", async () => {
    const originalFn = Notification.findAll;
    Notification.findAll = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app).get("/notification").expect(500);
    Notification.findAll = originalFn;
  });
});

describe("Update Notification", () => {
  test("200 Success", async () => {
    await request(app).put(`/notification/${testNotification.id}`).send({ read: true }).expect(200);
  });

  test("400 Validation Invalid Notification ID", async () => {
    await request(app).put("/notification/abc").send({ read: true }).expect(400);
  });

  test("400 Validation Invalid Read Value", async () => {
    await request(app).put(`/notification/${testNotification.id}`).send({ read: "abc" }).expect(400);
  });

  test("500 System Error", async () => {
    const originalFn = Notification.update;
    Notification.update = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app).put(`/notification/${testNotification.id}`).send({ read: true }).expect(500);
    Notification.update = originalFn;
  });
});

describe("Delete Notification", () => {
  test("200 Success", async () => {
    await request(app)
      .delete("/notification/" + testNotification.id)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app).delete("/notification/abc").expect(400);
  });

  test("404 Notification Not Found", async () => {
    await request(app).delete("/notification/0").expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Notification.destroy;
    Notification.destroy = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .delete("/notification/" + testNotification.id)
      .expect(500);
    Notification.destroy = originalFn;
  });
});
