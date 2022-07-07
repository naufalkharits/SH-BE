const request = require("supertest");
const { app, server } = require("../index");
const { Transaction, User } = require("../models");
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

let testProduct, testUserAccessToken, testTransaction;

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
    await request(app).get("/transaction").expect(200);
  });
  test("500 System Error", async () => {
    const originalFn = Transaction.findAll;
    Transaction.findAll = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app).get("/transaction").expect(500);
    Transaction.findAll = originalFn;
  });
});

describe("Get Transaction", () => {
  test("200 Success", async () => {
    await request(app)
      .get("/transaction/" + testTransaction.id)
      .expect(200);
  });

  test("400 Validation Failed", async () => {
    await request(app).get("/transaction/abc").expect(400);
  });

  test("404 Transaction Not Found", async () => {
    await request(app).get("/transaction/0").expect(404);
  });

  test("500 System Error", async () => {
    const originalFn = Transaction.findOne;
    Transaction.findOne = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app).get(`/transaction/${testProduct.id}`).expect(500);
    Transaction.findOne = originalFn;
  });
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

describe("Update Transaction", () => {
  test("200 Success", async () => {
    await request(app)
      .put("/transaction/" + testTransaction.id)
      .set("Authorization", testUserAccessToken)
      .send({
        price: 40000,
        status: "Rejected",
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
