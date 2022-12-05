const request = require("supertest");
const { app, server } = require("../index");
const { Transaction, User, UserBiodata, Product } = require("../models");
const path = require("path");
const bcrypt = require("bcrypt");

jest.mock("../utils/picture.js");

const testUserData = {
  name: "Test User",
  email: "test@gmail.com",
  password: "test123",
};

const testProductData = {
  name: "New Test Product",
  price: 50000,
  category: "Electronic",
  description: "This is new test product",
  weight: 100,
  pictures: path.join(__dirname, "resources", "product.png"),
};

let testProduct,
  testUserAccessToken,
  testTransaction,
  soldProduct,
  testUser2,
  testUser2AccessToken;

beforeAll(async () => {
  const registerResponse = await request(app)
    .post("/auth/register")
    .send(testUserData);

  testUserAccessToken = registerResponse.body.accessToken.token;

  await request(app)
    .put("/biodata")
    .set("Authorization", testUserAccessToken)
    .field("name", "Test User")
    .field("city", "Kota")
    .field("address", "Alamat")
    .field("phone_number", "08123456789")
    .attach("picture", path.join(__dirname, "resources", "product.png"))
    .expect(200);

  const createProductResponse = await request(app)
    .post("/product")
    .set("Authorization", testUserAccessToken)
    .field("name", testProductData.name)
    .field("price", testProductData.price)
    .field("category", testProductData.category)
    .field("description", testProductData.description)
    .field("weight", testProductData.weight)
    .attach("pictures", testProductData.pictures);

  testProduct = createProductResponse.body.product;

  testUser2 = await User.create({
    email: "test2@gmail.com",
    password: await bcrypt.hash("123456", 10),
  });

  soldProduct = await Product.create({
    name: "Sold Product",
    price: 50000,
    category_id: 1,
    description: "This is sold product!",
    weight: 100,
    seller_id: testUser2.id,
    status: "SOLD",
  });

  const loginResponse2 = await request(app).post("/auth/login").send({
    email: "test2@gmail.com",
    password: "123456",
  });

  testUser2AccessToken = loginResponse2.body.accessToken.token;
});

afterAll(async () => {
  await request(app)
    .delete("/product/" + testProduct.id)
    .set("Authorization", testUserAccessToken);

  await User.destroy({ where: {} });
  server.close();
});

describe("Create Transaction", () => {
  test("200 Success", async () => {
    const createRespone = await request(app)
      .post(`/transaction/${testProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .send({ price: 50000 })
      .expect(200);
    testTransaction = createRespone.body.transaction;
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .post("/transaction/abc")
      .set("Authorization", testUserAccessToken)
      .expect(400);
  });

  test("400 Biodata Verification Failed", async () => {
    const originalFn = UserBiodata.findOne;
    UserBiodata.findOne = jest.fn().mockImplementationOnce(() => null);

    await request(app)
      .post(`/transaction/${testProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .send({ price: 50000 })
      .expect(400);
    UserBiodata.findOne = originalFn;
  });

  test("404 Product Not Found", async () => {
    await request(app)
      .post("/transaction/0")
      .set("Authorization", testUserAccessToken)
      .send({
        price: 50000,
      })
      .expect(404);
  });

  test("404 Product Sold Out", async () => {
    await request(app)
      .post(`/transaction/${soldProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .send({
        price: 50000,
      })
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Transaction.create;
    Transaction.create = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    await request(app)
      .post(`/transaction/${testProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .send({ price: 50000 })
      .expect(500);
    Transaction.create = originalFn;
  });
});

describe("Get Transactions", () => {
  test("200 Success", async () => {
    await request(app)
      .get("/transaction")
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("200 Success as Seller", async () => {
    await request(app)
      .get("/transaction?as=seller")
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("200 Success as Buyer", async () => {
    await request(app)
      .get("/transaction?as=buyer")
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("200 Success Status Filtered", async () => {
    await request(app)
      .get("/transaction?status=completed")
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("500 System Error", async () => {
    const originalFn = Transaction.findAll;
    Transaction.findAll = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .get("/transaction")
      .set("Authorization", testUserAccessToken)
      .expect(500);
    Transaction.findAll = originalFn;
  });
});

describe("Get Transaction", () => {
  test("200 Success", async () => {
    await request(app)
      .get("/transaction/" + testTransaction.id)
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .get("/transaction/abc")
      .set("Authorization", testUserAccessToken)
      .expect(400);
  });

  test("404 Transaction Not Found", async () => {
    await request(app)
      .get("/transaction/0")
      .set("Authorization", testUserAccessToken)
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Transaction.findOne;
    Transaction.findOne = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .get(`/transaction/${testProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .expect(500);
    Transaction.findOne = originalFn;
  });
});

describe("Update Transaction", () => {
  test("200 Success Rejected", async () => {
    await request(app)
      .put("/transaction/" + testTransaction.id)
      .set("Authorization", testUserAccessToken)
      .send({
        price: 40000,
        status: "Rejected",
      })
      .expect(200);
  });

  test("200 Success Accepted", async () => {
    await request(app)
      .put("/transaction/" + testTransaction.id)
      .set("Authorization", testUserAccessToken)
      .send({
        price: 40000,
        status: "Accepted",
      })
      .expect(200);
  });

  test("200 Success Completed", async () => {
    await request(app)
      .put("/transaction/" + testTransaction.id)
      .set("Authorization", testUserAccessToken)
      .send({
        price: 40000,
        status: "Completed",
      })
      .expect(200);
  });

  test("400 Validation Transaction ID Failed", async () => {
    await request(app)
      .put("/transaction/abc")
      .set("Authorization", testUserAccessToken)
      .send({
        price: 40000,
        status: "Rejected",
      })
      .expect(400);
  });

  test("400 Validation Status Transaction Failed", async () => {
    await request(app)
      .put("/transaction/" + testTransaction.id)
      .set("Authorization", testUserAccessToken)
      .send({
        price: 40000,
        status: "abc",
      })
      .expect(400);
  });

  test("401 Unauthorized", async () => {
    await request(app)
      .put("/transaction/" + testTransaction.id)
      .set("Authorization", testUser2AccessToken)
      .send({
        price: 40000,
        status: "Rejected",
      })
      .expect(401);
  });

  test("404 Transaction Not Found", async () => {
    await request(app)
      .put("/transaction/0")
      .set("Authorization", testUserAccessToken)
      .send({
        price: 40000,
        status: "Rejected",
      })
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Transaction.update;
    Transaction.update = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .put("/transaction/" + testTransaction.id)
      .set("Authorization", testUserAccessToken)
      .send({
        price: 40000,
        status: "Rejected",
      })
      .expect(500);
    Transaction.update = originalFn;
  });
});

describe("Delete Transaction", () => {
  test("401 Unauthorized", async () => {
    await request(app)
      .delete("/transaction/" + testTransaction.id)
      .set("Authorization", testUser2AccessToken)
      .send({
        price: 40000,
        status: "Rejected",
      })
      .expect(401);
  });

  test("200 Success", async () => {
    await request(app)
      .delete("/transaction/" + testTransaction.id)
      .set("Authorization", testUserAccessToken)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .delete("/transaction/abc")
      .set("Authorization", testUserAccessToken)
      .expect(400);
  });

  test("404 Transaction Not Found", async () => {
    await request(app)
      .delete("/transaction/0")
      .set("Authorization", testUserAccessToken)
      .expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Transaction.destroy;
    Transaction.destroy = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .delete("/transaction/" + testTransaction.id)
      .set("Authorization", testUserAccessToken)
      .expect(500);
    Transaction.destroy = originalFn;
  });
});
