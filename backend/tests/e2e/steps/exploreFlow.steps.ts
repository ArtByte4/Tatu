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
let searchResponse: Response;
let profileResponse: Response;

Before({ tags: "@e2e-explore" }, async function () {
  mockDatabase = new MockDatabase();

  await mockDatabase.seedUser({
    user_handle: "juan_higuera",
    email_address: "juan.higuera@tatu.test",
    first_name: "Juan",
    last_name: "Higuera",
    phonenumber: "3110000001",
    password_hash: await encryptPassword("ClaveExplore123!"),
    birth_day: "2001-02-02",
    bio: "Fan del blackwork",
  });

  await mockDatabase.seedUser({
    user_handle: "carlos_ink",
    email_address: "carlos.ink@tatu.test",
    first_name: "Carlos",
    last_name: "Ramirez",
    phonenumber: "3110000002",
    password_hash: await encryptPassword("ClaveCarlos123!"),
    birth_day: "1999-03-03",
    bio: "Tatuador realista",
    image: "https://cdn.tatu.app/profiles/carlos.png",
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

After({ tags: "@e2e-explore" }, function () {
  const db = connection as unknown as { query: QueryFn };
  db.query = originalQuery;
});

Given("existe un entorno preparado para el flujo explore e2e", function () {
  // Inicializado en Before.
});

When("inicio sesion y consulto explore con una busqueda valida", async function () {
  loginResponse = await agent.post("/api/users/auth/login").send({
    user_handle: "juan_higuera",
    password_hash: "ClaveExplore123!",
  });

  searchResponse = await agent.get("/api/users/search").query({ q: "carlos" });

  const firstUserHandle = searchResponse.body[0]?.user_handle as string;
  profileResponse = await agent.get(`/api/users/profile/${firstUserHandle}`);
});

Then("el flujo explore e2e finaliza exitosamente", function () {
  expect(loginResponse.status).to.equal(200);
  expect(loginResponse.body.validation).to.equal(true);

  expect(searchResponse.status).to.equal(200);
  expect(searchResponse.body).to.be.an("array");
  expect(searchResponse.body.length).to.be.greaterThan(0);
  expect(searchResponse.body[0].user_handle).to.equal("carlos_ink");

  expect(profileResponse.status).to.equal(200);
  expect(profileResponse.body.user_handle).to.equal("carlos_ink");
  expect(profileResponse.body.first_name).to.equal("Carlos");
});
