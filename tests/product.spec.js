const request = require("supertest");
const { app, server } = require("../index");
const path = require("path");
const { Product, User, Category, UserBiodata } = require("../models");
const bcrypt = require("bcrypt");

jest.mock("../utils/picture.js");

const newProductData = {
  name: "New Test Product",
  price: 50000,
  category: "Electronic",
  description: "This is new test product",
  weight: 100,
  pictures: path.join(__dirname, "resources", "product.png"),
};

let testUser, testProduct, testUserToken;

beforeAll(async () => {
  const testUserData = {
    email: "test@gmail.com",
    password: "test123",
  };
  testUser = await User.create({
    email: testUserData.email,
    password: await bcrypt.hash(testUserData.password, 10),
  });
  testProduct = await Product.create({
    name: "New Test Product",
    price: 50000,
    category_id: 3,
    description: "This is new test product",
    weight: 100,
    seller_id: testUser.id,
  });
  await UserBiodata.create({
    user_id: testUser.id,
    name: "Test User",
    province: "Provinsi",
    city: "Kota",
    address: "Alamat",
    phone_number: "08123456789",
    picture: "profile.png",
  });
  const loginResponse = await request(app).post("/auth/login").send({
    email: testUserData.email,
    password: testUserData.password,
  });
  testUserToken = loginResponse.body.accessToken.token;
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

  test("200 Success with Searching", async () => {
    await request(app).get("/product?keyword=abc").expect(200);
  });

  test("500 System Error", async () => {
    const originalFn = Product.findAll;
    Product.findAll = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app).get("/product").expect(500);
    Product.findAll = originalFn;
  });
});

describe("Get Product", () => {
  test("200 Success", async () => {
    await request(app).get(`/product/${testProduct.id}`).expect(200);
  });
  test("400 Validation Failed", async () => {
    await request(app).get(`/product/abc`).expect(400);
  });
  test("404 Product Not Found", async () => {
    await request(app).get(`/product/0`).expect(404);
  });
  test("500 System Error", async () => {
    const originalFn = Product.findOne;
    Product.findOne = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app).get(`/product/${testProduct.id}`).expect(500);
    Product.findOne = originalFn;
  });
});

describe("Create Product", () => {
  test("200 Success", async () => {
    await request(app)
      .post("/product")
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", newProductData.pictures)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .post("/product")
      .set("Authorization", testUserToken)
      .expect(400);
  });

  test("400 Picture Validation Failed", async () => {
    await request(app)
      .post("/product")
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", path.join(__dirname, "resources", "product.txt"))
      .expect(400);
  });

  test("400 Biodata Verification Failed", async () => {
    const originalFn = UserBiodata.findOne;
    UserBiodata.findOne = jest.fn().mockImplementationOnce(() => null);

    await request(app)
      .post("/product")
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", newProductData.pictures)
      .expect(400);
    UserBiodata.findOne = originalFn;
  });

  test("400 Invalid Category", async () => {
    await request(app)
      .post("/product")
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", "invalid")
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", newProductData.pictures)
      .expect(400);
  });

  test("409 Max Products Count", async () => {
    const originalFn = Product.count;
    Product.count = jest.fn().mockImplementationOnce(() => 4);

    await request(app)
      .post("/product")
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", newProductData.pictures)
      .expect(409);
    Product.count = originalFn;
  });

  test("500 System Error", async () => {
    const originalFn = Product.create;
    Product.create = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    await request(app)
      .post("/product")
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", newProductData.pictures)
      .expect(500);
    Product.create = originalFn;
  });
});

describe("Update Product", () => {
  test("200 Success", async () => {
    await request(app)
      .put("/product/" + testProduct.id)
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", newProductData.pictures)
      .expect(200);
  });

  test("400 Invalid Product ID", async () => {
    await request(app)
      .put("/product/abc")
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", newProductData.pictures)
      .expect(400);
  });

  test("400 Invalid Category", async () => {
    await request(app)
      .put("/product/" + testProduct.id)
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", "invalid")
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", newProductData.pictures)
      .expect(400);
  });

  test("400 Invalid Status", async () => {
    await request(app)
      .put("/product/" + testProduct.id)
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", "invalid")
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .field("status", "invalidstatus")
      .attach("pictures", newProductData.pictures)
      .expect(400);
  });

  test("404 Product Not Found", async () => {
    await request(app)
      .put("/product/0")
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", newProductData.pictures)
      .expect(404);
  });

  test("400 Picture Validation Failed", async () => {
    await request(app)
      .put("/product/" + testProduct.id)
      .set("Authorization", testUserToken)
      .attach("pictures", path.join(__dirname, "resources", "product.txt"))
      .expect(400);
  });

  test("500 System Error", async () => {
    const originalFn = Category.findOne;
    Category.findOne = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    await request(app)
      .put("/product/" + testProduct.id)
      .set("Authorization", testUserToken)
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .field("weight", newProductData.weight)
      .attach("pictures", newProductData.pictures)
      .expect(500);
    Category.findOne = originalFn;
  });
});

describe("Delete Product", () => {
  test("200 Success", async () => {
    await request(app)
      .delete("/product/" + testProduct.id)
      .set("Authorization", testUserToken)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .delete("/product/" + "invalid")
      .set("Authorization", testUserToken)
      .expect(400);
  });

  test("404 Product Not Found", async () => {
    await request(app)
      .delete("/product/")
      .set("Authorization", testUserToken)
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Product.destroy;
    Product.destroy = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .delete("/product/" + testProduct.id)
      .set("Authorization", testUserToken)
      .expect(500);
    Product.destroy = originalFn;
  });
});
