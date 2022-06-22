const request = require("supertest");
const { app, server } = require("../index");
const path = require("path");
const { Product, User, Category } = require("../models");

jest.mock("../utils/picture.js");

const newProductData = {
  name: "New Test Product",
  price: 50000,
  category: "Electronic",
  description: "This is new test product",
  pictures: path.join(__dirname, "resources", "product.png"),
};

let testUser, testProduct;

beforeAll(async () => {
  testUser = await User.create({
    email: "test@gmail.com",
    password: "test123",
  });
  testProduct = await Product.create({
    name: "New Test Product",
    price: 50000,
    category_id: 3,
    description: "This is new test product",
    seller_id: testUser.id,
  });
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await Product.destroy({ where: {} });
  server.close();
});

describe("Get Products", () => {
  test("200 Success", async () => {
    await request(app).get("/product").expect(200);
  });
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
  const { body, statusCode, error } = await request(app).get(
    "/product/" + newProduct.id
  );
  expect(statusCode).toEqual(200);
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

describe("Update Product", () => {
  test("200 Success", async () => {
    await request(app)
      .put("/product/" + testProduct.id)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .attach("pictures", newProductData.pictures)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .put("/product/" + testProduct.id)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", "invalid")
      .field("description", newProductData.description)
      .attach("pictures", newProductData.pictures)
      .expect(400);
  });

  test("404 Product Not Found", async () => {
    await request(app)
      .put("/product/")
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .attach("pictures", newProductData.pictures)
      .expect(404);
  });

  test("500 System Error", async () => {
    Category.findOne = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    await request(app)
      .put("/product/" + testProduct.id)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .attach("pictures", newProductData.pictures)
      .expect(500);
  });
});

describe("Delete Product", () => {
  test("200 Success", async () => {
    await request(app)
      .delete("/product/" + testProduct.id)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .delete("/product/" + "invalid")
      .expect(400);
  });

  test("404 Product Not Found", async () => {
    await request(app).delete("/product/").expect(404);
  });

  test("500 System Error", async () => {
    Product.destroy = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .delete("/product/" + testProduct.id)
      .expect(500);
  });
});

describe("Login", () => {
  test("200 Success", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email: "test321@gmail.com", password: "123456" })
      .expect(200);
  });

  test("409 Email already exists", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email: "test321@gmail.com", password: "123456" })
      .expect(409);
  });

  test("400 Invalid Email", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email: "inibukanemail", password: "123456" })
      .expect(400);
  });

  test("500 system error / unexpected error", async () => {
    User.create = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .post("/auth/login")
      .send({ email: "test3210@gmail.com", password: "123456" })
      .expect(500);
  });
});

describe("Register", () => {
  test("200 Success", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "test321@gmail.com", password: "123456" })
      .expect(200);
  });

  test("409 Email already exists", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "test321@gmail.com", password: "123456" })
      .expect(409);
  });

  test("400 Invalid Email", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "inibukanemail", password: "123456" })
      .expect(400);
  });

  test("500 Failed Create New User", async () => {
    User.create = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .post("/auth/register")
      .send({ email: "test3210@gmail.com", password: "123456" })
      .expect(500);
  });
});

module.exports = { testUser };
