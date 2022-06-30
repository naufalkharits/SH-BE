const request = require("supertest");
const { app, server } = require("../index");
const { Wishlist, Product, User } = require("../models");
const bcrypt = require("bcrypt");

let testUser, testProduct, testProduct2;

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
    seller_id: testUser.id,
  });
  testProduct2 = await Product.create({
    name: "New Test Product2",
    price: 50000,
    category_id: 3,
    description: "This is new test product2",
    seller_id: testUser.id,
  });
});
afterAll(async () => {
  try {
    await User.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Wishlist.destroy({ where: {} });
    server.close();
  } catch (error) {
    console.log("Error : ", error);
  }
});

describe("Create Wishlist", () => {
  test("200 Success", async () => {
    await request(app)
      .post("/wishlist")
      .send({
        product_id: testProduct.id,
        user_id: testUser.id,
      })
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .post("/wishlist")
      .send({
        product_id: "abc",
        user_id: "abc",
      })
      .expect(400);
  });

  test("400 Product is alrerady in wishlist", async () => {
    await request(app)
      .post("/wishlist")
      .send({
        product_id: testProduct.id,
        user_id: testUser.id,
      })
      .expect(400);
  });

  test("404 Product Does Not Exist", async () => {
    await request(app)
      .post("/wishlist")
      .send({
        product_id: 2,
        user_id: testUser.id,
      })
      .expect(404);
  });

  test("404 User Does Not Exist", async () => {
    await request(app)
      .post("/wishlist")
      .send({
        product_id: testProduct.id,
        user_id: 2,
      })
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Wishlist.create;
    Wishlist.create = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .post("/wishlist")
      .send({
        product_id: testProduct2.id,
        user_id: testUser.id,
      })
      .expect(500);
    Wishlist.create = originalFn;
  });
});

describe("Delete Wishlist", () => {
  test("200 Success", async () => {
    await request(app)
      .delete("/wishlist/")
      .send({
        product_id: testProduct.id,
        user_id: testUser.id,
      })
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .delete("/wishlist/")
      .send({
        product_id: "abc",
        user_id: "abc",
      })
      .expect(400);
  });

  test("404 Product Does Not Exist", async () => {
    await request(app)
      .post("/wishlist")
      .send({
        product_id: 2,
        user_id: testUser.id,
      })
      .expect(404);
  });

  test("404 User Does Not Exist", async () => {
    await request(app)
      .post("/wishlist")
      .send({
        product_id: testProduct.id,
        user_id: 2,
      })
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Wishlist.destroy;
    Wishlist.destroy = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .delete("/wishlist/")
      .send({
        product_id: testProduct2.id,
        user_id: testUser.id,
      })
      .expect(500);
    Wishlist.destroy = originalFn;
  });
});
