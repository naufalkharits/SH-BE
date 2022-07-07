const request = require("supertest");
const { app, server } = require("../index");
const { Transaction, User, Product } = require("../models");
const path = require("path");

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
  pictures: path.join(__dirname, "resources", "product.png"),
};

let testProduct, testUserAccessToken;

beforeAll(async () => {
  try {
    const registerResponse = await request(app)
      .post("/auth/register")
      .send(testUserData);

    testUserAccessToken = registerResponse.body.accessToken.token;

    const createProductResponse = await request(app)
      .post("/product")
      .set("Authorization", testUserAccessToken)
      .field("name", testProductData.name)
      .field("price", testProductData.price)
      .field("category", testProductData.category)
      .field("description", testProductData.description)
      .attach("pictures", testProductData.pictures);

    testProduct = createProductResponse.body.product;
  } catch (error) {
    console.log("Error : ", error);
  }
});

afterAll(async () => {
  try {
    await request(app)
      .delete("/product/" + testProduct.id)
      .set("Authorization", testUserAccessToken);

    await User.destroy({ where: {} });
    server.close();
  } catch (error) {
    console.log("Error : ", error);
  }
});

describe("Get Transactions", () => {
  test("200 Success", async () => {
    await request(app)
      .post(`/transaction`)
      .set("Authorization", testUserAccessToken)
      .send({ price: 50000 })
      .expect(200);
  });
});

describe("Create Transaction", () => {
  test("200 Success", async () => {
    await request(app)
      .post(`/transaction/${testProduct.id}`)
      .set("Authorization", testUserAccessToken)
      .send({ price: 50000 })
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app)
      .post("/transaction/abc")
      .set("Authorization", testUserAccessToken)
      .expect(400);
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
