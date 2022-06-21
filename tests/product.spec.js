const request = require("supertest");
const { app, server } = require("../index");
const path = require("path");
const { Product, User } = require("../models");

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
describe("Get Product", () => {
  test("Get Product", async () => {
    const { statusCode, error } = await request(app).get("/product");
    expect(statusCode).toEqual(200);
  });

  test("Get Product by ID", async () => {
    const newUser = await User.create({
      email: "a@gmail.com",
      password: "test123",
    });
    const newProduct = await Product.create({
      name: "New Test Product",
      price: 50000,
      category_id: 3,
      description: "This is new test product",
      seller_id: newUser.id,
    });
    console.log(newProduct);
    const { body, statusCode, error } = await request(app).get("/product/" + newProduct.id);
    expect(statusCode).toEqual(200);
  });
}),
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

describe("Update Product", () => {
  test("200 Success", async () => {
    await request(app)
      .put("/update-product/" + newProductData.id)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .attach("pictures", newProductData.pictures)
      .expect(200);
  });

  // test("400 Validation Failed", async () => {
  //   await request(app)
  //     .put("/update-product/" + newProductData.id)
  //     .field("name", newProductData.name)
  //     .field("price", newProductData.price)
  //     .field("category", "invalid")
  //     .field("description", newProductData.description)
  //     .attach("pictures", newProductData.pictures)
  //     .expect(400);
  // });

  // test("404 Product Not Found", async () => {
  //   await request(app)
  //     .put("/update-product/" + "invalid")
  //     .field("name", newProductData.name)
  //     .field("price", newProductData.price)
  //     .field("category", newProductData.category)
  //     .field("description", newProductData.description)
  //     .attach("pictures", newProductData.pictures)
  //     .expect(404);
  // });

  // test("500 System Error", async () => {
  //   Product.update = jest.fn().mockImplementationOnce(() => {
  //     throw new Error();
  //   });

    await request(app)
      .put("/update-product/" + newProductData.id)
      .expect(500);
  });
});
