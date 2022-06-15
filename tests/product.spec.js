const controller = require("../controllers/product.controller");
const Product = require("../models").Product;
const Category = require("../models").Category;
const ImageUtil = require("../utils/picture");

jest.mock("fs/promises");

const mockRequest = ({ body, params, query, files }) => ({
  body,
  params,
  query,
  files,
});

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe("Create Product", () => {
  test("200 Success", async () => {
    const newProductData = {
      name: "Product A",
      price: 100000,
      category: "Category A",
      description: "This is new product data",
    };

    const newProductPictures = [
      { name: "picture1", size: 1000, mimetype: "image/png", buffer: null },
      { name: "picture2", size: 1000, mimetype: "image/png", buffer: null },
    ];

    const req = mockRequest({
      body: newProductData,
      files: newProductPictures,
    });
    const res = mockResponse();

    Category.findOne = jest.fn().mockImplementationOnce(() => true);

    Product.create = jest
      .fn()
      .mockImplementationOnce(() => ({ dataValues: newProductData }));

    ImageUtil.uploadImages = jest.fn().mockImplementationOnce(() => true);

    await controller.createProduct(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      product: { ...newProductData, pictures: true },
    });
  }),
    test("400 Validation Failed", async () => {
      const req = mockRequest({ body: null });
      const res = mockResponse();

      await controller.createProduct(req, res);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        type: "VALIDATION_FAILED",
        message: "Product name, price, category, and description is required",
      });
    }),
    test("400 Category Validation Failed", async () => {
      const newProductData = {
        name: "Product A",
        price: 100000,
        category: "Category A",
        description: "This is new product data",
      };

      const req = mockRequest({ body: newProductData });
      const res = mockResponse();

      Category.findOne = jest.fn().mockImplementationOnce(() => false);

      await controller.createProduct(req, res);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        type: "VALIDATION_FAILED",
        message: "Valid category name is required",
      });
    }),
    test("500 System Error", async () => {
      const newProductData = {
        name: "Product A",
        price: 100000,
        category: "Category A",
        description: "This is new product data",
      };

      const req = mockRequest({ body: newProductData });
      const res = mockResponse();

      Category.findOne = jest.fn().mockImplementationOnce(() => {
        throw new Error("System Error");
      });

      await controller.createProduct(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledWith({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }),
    test("400 Image Size", async () => {
      const newProductData = {
        name: "Product A",
        price: 100000,
        category: "Category A",
        description: "This is new product data",
      };

      const newProductPictures = [
        {
          name: "picture1",
          size: 10000000,
          mimetype: "image/png",
          buffer: null,
        },
        {
          name: "picture2",
          size: 10000000,
          mimetype: "image/png",
          buffer: null,
        },
      ];

      const req = mockRequest({
        body: newProductData,
        files: newProductPictures,
      });
      const res = mockResponse();

      await controller.createProduct(req, res);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        type: "VALIDATION_FAILED",
        message: "Picture size cannot be larger than 5 MB",
      });
    }),
    test("400 Image Format", async () => {
      const newProductData = {
        name: "Product A",
        price: 100000,
        category: "Category A",
        description: "This is new product data",
      };

      const newProductPictures = [
        {
          name: "picture1",
          size: 1000000,
          mimetype: "txt",
          buffer: null,
        },
        {
          name: "picture2",
          size: 1000000,
          mimetype: "txt",
          buffer: null,
        },
      ];

      const req = mockRequest({
        body: newProductData,
        files: newProductPictures,
      });
      const res = mockResponse();

      await controller.createProduct(req, res);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        type: "VALIDATION_FAILED",
        message: "Valid picture format is required",
      });
    });
});
