const request = require("supertest");
const { app, server } = require("../index");
const path = require("path");
const { Product } = require("../models");

jest.mock("../utils/picture.js");

const newProductData = {
  name: "New Test Product",
  price: 50000,
  category: "Electronic",
  description: "This is new test product",
  pictures: path.join(__dirname, "resources", "product.png"),
};

afterAll(async () => {
  await Product.destroy({ where: {} });
  server.close();
});

describe("Create Product", () => {
  test("200 Success", async () => {
    await request(app)
      .post("/product")
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .attach("pictures", newProductData.pictures)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app).post("/product").expect(400);
  });

  test("400 Picture Validation Failed", async () => {
    await request(app)
      .post("/product")
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .attach("pictures", path.join(__dirname, "resources", "product.txt"))
      .expect(400);
  });

  test("400 Invalid Category", async () => {
    await request(app)
      .post("/product")
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", "invalid")
      .field("description", newProductData.description)
      .attach("pictures", newProductData.pictures)
      .expect(400);
  });

  test("500 System Error", async () => {
    Product.create = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    await request(app)
      .post("/product")
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .attach("pictures", newProductData.pictures)
      .expect(500);
  });
});
