const request = require("supertest");
const { app } = require("../index");
const { Category } = require("../models");

describe("Get Category", () => {
  test("200 Success", async () => {
    await request(app).get("/category").expect(200);
  });

  test("404 Category Not Found", async () => {
    await request(app).get("/category/0").expect(404);
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
