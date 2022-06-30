const request = require("supertest");
const { app, server } = require("../index");
const { Wishlist, Product, User } = require("../models");
const { bcrypt } = require("bcrypt");

let testUser, testProduct;

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
  test("200 Success", async () => {});

  test("400 Validation Failed", () => {});

  test("400 Product is alrerady in wishlist", () => {});

  test("404 Product Does Not Exist", () => {});

  test("404 User Does Not Exist", () => {});

  test("500 System Error", () => {});
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
      .delete("/product/")
      .send({
        product_id: testProduct.id,
        user_id: testUser.id,
      })
      .expect(400);
  });

  test("404 Product Not Found", async () => {
    await request(app)
      .delete("/wishlist/")
      .send({
        product_id: "testProduct",
        user_id: "2",
      })
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Product.destroy;
    Product.destroy = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .delete("/product/" + testProduct.id)
      .send({
        product_id: testProduct.id,
        user_id: testUser.id,
      })
      .expect(500);
    Product.destroy = originalFn;
  });
});
