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

// describe("Get Notifications", () => {});

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

// describe("Delete Notification", () => {});
