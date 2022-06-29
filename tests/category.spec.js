const request = require("supertest");
const { app, server } = require("../index");
const { Category } = require("../models");

afterAll(async () => {
  server.close();
});

describe("Get Category", () => {
  test("200 Success", async () => {
    await request(app).get("/category").expect(200);
  });

  test("500 System Error", async () => {
    const originalFn = Category.findAll;
    Category.findAll = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app).get("/category").expect(500);
    Category.findAll = originalFn;
  });
});
