import { After, Before, Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import cookieParser from "cookie-parser";
import express from "express";
import request, { Response, SuperAgentTest } from "supertest";

import connection from "../../../src/db";
import router from "../../../src/routes";
import { MockDatabase } from "./support/mockDatabase";

type QueryFn = (sql: string, params?: unknown) => Promise<[unknown, unknown]>;

let mockDatabase: MockDatabase;
let originalQuery: QueryFn;
let agent: SuperAgentTest;

let registerResponse: Response;
let loginResponse: Response;
let protectedResponse: Response;
let logoutResponse: Response;
let protectedAfterLogoutResponse: Response;

Before({ tags: "@e2e-auth" }, function () {
  mockDatabase = new MockDatabase();

  const db = connection as unknown as { query: QueryFn };
  originalQuery = db.query.bind(connection);
  db.query = mockDatabase.query;

  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use(router);
  agent = request.agent(app);
});

After({ tags: "@e2e-auth" }, function () {
  const db = connection as unknown as { query: QueryFn };
  db.query = originalQuery;
});

Given("existe un entorno limpio para el flujo auth e2e", function () {
  // Inicializado en Before.
});

When(
  "completo el flujo de registro, login, acceso protegido y logout",
  async function () {
    registerResponse = await agent.post("/api/users").send({
      user_handle: "michael_auth",
      email_address: "michael.auth@tatu.test",
      first_name: "Michael",
      last_name: "Castro",
      phonenumber: "3001234567",
      password_hash: "ClaveAuth123!",
      birth_day: "2000-10-10",
    });

    loginResponse = await agent.post("/api/users/auth/login").send({
      user_handle: "michael_auth",
      password_hash: "ClaveAuth123!",
    });

    protectedResponse = await agent.get("/api/users/search").query({ q: "michael" });

    logoutResponse = await agent.post("/api/users/auth/logout");

    protectedAfterLogoutResponse = await agent
      .get("/api/users/search")
      .query({ q: "michael" });
  }
);

Then("el flujo auth e2e finaliza exitosamente", function () {
  expect(registerResponse.status).to.equal(201);
  expect(registerResponse.body.message).to.equal("Usuario registrado");

  expect(loginResponse.status).to.equal(200);
  expect(loginResponse.body.validation).to.equal(true);
  expect(loginResponse.body.user).to.equal("michael_auth");

  expect(protectedResponse.status).to.equal(200);
  expect(protectedResponse.body).to.be.an("array");
  expect(protectedResponse.body.length).to.equal(1);

  expect(logoutResponse.status).to.equal(200);
  expect(logoutResponse.body.message).to.equal("Logout successful");

  expect(protectedAfterLogoutResponse.status).to.equal(401);
});
