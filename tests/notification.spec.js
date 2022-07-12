const request = require("supertest");
const { app, server } = require("../index");
const { Notification } = require("../models");

beforeAll(async () => {});

afterAll(async () => {
  server.close();
});

let testUserAccessToken;

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

describe("Update Notification", () => {});

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
