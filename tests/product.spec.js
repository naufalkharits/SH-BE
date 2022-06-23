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
  try {
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
  } catch (error) {
    console.log("Error : ", error);
  }
});

afterAll(async () => {
  try {
    await User.destroy({ where: {} });
    await Product.destroy({ where: {} });
    server.close();
  } catch (error) {
    console.log("Error : ", error);
  }
});

describe("Get Products", () => {
  test("200 Success", async () => {
    await request(app).get("/product").expect(200);
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
  /* test("200 Success", async () => {
    await request(app)
      .post("/product")
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .attach("pictures", newProductData.pictures)
      .expect(200);
  });*/

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
    const originalFn = Product.create;
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
    Product.create = originalFn;
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

  test("400 Invalid Product ID", async () => {
    await request(app)
      .put("/product/abc")
      .field("name", newProductData.name)
      .field("price", newProductData.price)
      .field("category", newProductData.category)
      .field("description", newProductData.description)
      .attach("pictures", newProductData.pictures)
      .expect(400);
  });

  test("400 Invalid Category", async () => {
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
    const originalFn = Category.findOne;
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
    Category.findOne = originalFn;
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
    const originalFn = Product.destroy;
    Product.destroy = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app)
      .delete("/product/" + testProduct.id)
      .expect(500);
    Product.destroy = originalFn;
  });
});
