import { After, Before, Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import cookieParser from "cookie-parser";
import express from "express";
import request, { Response, SuperAgentTest } from "supertest";

import { encryptPassword } from "../../../src/modules/auth/authService";
import connection from "../../../src/db";
import router from "../../../src/routes";
import { MockDatabase } from "./support/mockDatabase";

type QueryFn = (sql: string, params?: unknown) => Promise<[unknown, unknown]>;

let mockDatabase: MockDatabase;
let originalQuery: QueryFn;
let agent: SuperAgentTest;

let loginResponse: Response;
let createPostResponse: Response;
let feedResponse: Response;

Before({ tags: "@e2e-post" }, async function () {
  mockDatabase = new MockDatabase();

  await mockDatabase.seedUser({
    user_handle: "cristina_post",
    email_address: "cristina.munoz@tatu.test",
    first_name: "Cristina",
    last_name: "Munoz",
    phonenumber: "3120000001",
    password_hash: await encryptPassword("ClavePost123!"),
    birth_day: "2002-04-04",
    bio: "Publicando arte en Tatu",
  });

  const db = connection as unknown as { query: QueryFn };
  originalQuery = db.query.bind(connection);
  db.query = mockDatabase.query;

  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use(router);
  agent = request.agent(app);
});

After({ tags: "@e2e-post" }, function () {
  const db = connection as unknown as { query: QueryFn };
  db.query = originalQuery;
});

Given("existe un entorno preparado para el flujo post e2e", function () {
  // Inicializado en Before.
});

When("inicio sesion y publico un post con imagen", async function () {
  loginResponse = await agent.post("/api/users/auth/login").send({
    user_handle: "cristina_post",
    password_hash: "ClavePost123!",
  });

  createPostResponse = await agent.post("/api/posts").send({
    post_text: "Mi primer post e2e de tatuajes",
    tattoo_styles_id: 1,
    image_urls: ["https://cdn.tatu.app/posts/post-e2e.png"],
  });

  feedResponse = await agent.get("/api/posts");
});

Then("el flujo post e2e finaliza exitosamente", function () {
  expect(loginResponse.status).to.equal(200);
  expect(loginResponse.body.validation).to.equal(true);

  expect(createPostResponse.status).to.equal(201);
  expect(createPostResponse.body.post_text).to.equal("Mi primer post e2e de tatuajes");
  expect(createPostResponse.body.images).to.be.an("array");
  expect(createPostResponse.body.images.length).to.equal(1);

  expect(feedResponse.status).to.equal(200);
  expect(feedResponse.body).to.be.an("array");
  expect(feedResponse.body.length).to.equal(1);

  const postFromFeed = feedResponse.body[0];
  expect(postFromFeed.post_text).to.equal("Mi primer post e2e de tatuajes");
  expect(postFromFeed.images).to.be.an("array");
  expect(postFromFeed.images.length).to.equal(1);
});
