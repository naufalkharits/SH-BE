const request = require("supertest");
const { app, server } = require("../index");
const { Chat, ChatMessage, User, Product } = require("../models");
const bcrypt = require("bcrypt");

let testChat;

beforeAll(async () => {
  const buyer = await User.create({
    email: "buyer@gmail.com",
    password: await bcrypt.hash("123456", 10),
  });
  const seller = await User.create({
    email: "seller@gmail.com",
    password: await bcrypt.hash("123456", 10),
  });

  testChat = await Chat.create({
    buyer_id: buyer.id,
    seller_id: seller.id,
  });

  const testBuyerChatMessage = await Chat.create({
    chat_id: testChat.id,
    user_id: buyer.id,
    message: "Hello from Buyer!",
  });

  const testSellerChatMessage = await Chat.create({
    chat_id: testChat.id,
    user_id: seller.id,
    message: "Hello from Seller!",
  });
});

afterAll(async () => {
  try {
    await User.destroy({ where: {} });
    await Chat.destroy({ where: {} });
    server.close();
  } catch (error) {
    console.log(error);
  }
});

describe("Get Chats", () => {});

describe("Get Chat", () => {});
