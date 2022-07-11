const request = require("supertest");
const { app, server } = require("../index");
const { Notification } = require("../models");

beforeAll(async () => {});

afterAll(async () => {
  server.close();
});

describe("Get Notifications", () => {});

describe("Update Notification", () => {});

describe("Delete Notification", () => {});
