const request = require("supertest");
const { app, server } = require("../index");
const { Wishlist, Product, User } = require("../models");
const bcrypt = require("bcrypt");

let testUser, testProduct, testProduct2, testUserAccessToken;

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
  testProduct2 = await Product.create({
    name: "New Test Product2",
    price: 50000,
    category_id: 3,
    description: "This is new test product2",
    weight: 100,
    seller_id: testUser.id,
  });
  testProduct3 = await Product.create({
    name: "New Test Product3",
    price: 50000,
    category_id: 3,
    description: "This is new test product3",
    weight: 100,
    seller_id: testUser.id,
  });
  await Wishlist.create({
    product_id: testProduct3.id,
    user_id: testUser.id,
  });

  const loginResponse = await request(app)
    .post("/auth/login")
    .send(testUserData);

  testUserAccessToken = loginResponse.body.accessToken.token;
});
afterAll(async () => {
  await User.destroy({ where: {} });
  await Product.destroy({ where: {} });
  await Wishlist.destroy({ where: {} });
  server.close();
});

describe("Check Wishlist", () => {
  test("200 Success Wishlist False", async () => {
    await request(app)
      .get(`/wishlist/${testProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("200 Success Wishlist True", async () => {
    await request(app)
      .get(`/wishlist/${testProduct3.id}`)
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .get("/wishlist/abc")
      .set("Authorization", testUserAccessToken)
      .expect(400);
  });

  test("404 Product Not Found", async () => {
    await request(app)
      .get("/wishlist/0")
      .set("Authorization", testUserAccessToken)
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Wishlist.findOne;
    Wishlist.findOne = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .get(`/wishlist/${testProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .expect(500);
    Wishlist.findOne = originalFn;
  });
});

describe("Get Wishlists", () => {
  test("200 Success Buyer", async () => {
    await request(app)
      .get("/wishlist")
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("200 Success Seller", async () => {
    await request(app)
      .get("/wishlist?as=seller")
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("500 System Error", async () => {
    const originalFn = Wishlist.findAll;
    Wishlist.findAll = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .get("/wishlist")
      .set("Authorization", testUserAccessToken)
      .expect(500);
    Wishlist.findAll = originalFn;
  });
});

describe("Create Wishlist", () => {
  test("200 Success", async () => {
    await request(app)
      .post(`/wishlist/${testProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .post("/wishlist/abc")
      .set("Authorization", testUserAccessToken)
      .expect(400);
  });

  test("404 Product Not Found", async () => {
    await request(app)
      .post("/wishlist/0")
      .set("Authorization", testUserAccessToken)
      .expect(404);
  });

  test("409 Product Already Wishlisted", async () => {
    await request(app)
      .post(`/wishlist/${testProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .expect(409);
  });

  test("500 System Error", async () => {
    const originalFn = Wishlist.create;
    Wishlist.create = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .post(`/wishlist/${testProduct2.id}`)
      .set("Authorization", testUserAccessToken)
      .expect(500);
    Wishlist.create = originalFn;
  });
});

describe("Delete Wishlist", () => {
  test("200 Success", async () => {
    await request(app)
      .delete(`/wishlist/${testProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .delete(`/wishlist/abc`)
      .set("Authorization", testUserAccessToken)
      .expect(400);
  });

  test("404 Product Does Not Exist", async () => {
    await request(app)
      .post("/wishlist/0")
      .set("Authorization", testUserAccessToken)
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Wishlist.destroy;
    Wishlist.destroy = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .delete(`/wishlist/${testProduct3.id}`)
      .set("Authorization", testUserAccessToken)
      .expect(500);
    Wishlist.destroy = originalFn;
  });
});
