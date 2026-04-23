import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";
import request, { Response } from "supertest";
import { verificarAdmin } from "../../../src/modules/user/middlewares/validateAdmin";

let cookieHeader: string | undefined;
let response: Response;

const app = express();
app.use(cookieParser());
app.get("/admin-only", verificarAdmin, (_req, res) => {
  res.status(200).json({ ok: true });
});

Given("no envío cookie access_token", function () {
  cookieHeader = undefined;
});

Given("envío un token válido con rol de administrador", function () {
  const secret = process.env.SECRET_JWT_KEY as string;
  const adminRole = Number(process.env.ID_ROL_ADMIN ?? "3");
  const token = jwt.sign({ id: 1, role: adminRole, username: "admin" }, secret, {
    expiresIn: "1h",
  });
  cookieHeader = `access_token=${token}`;
});

Given("envío un token válido con rol no administrador", function () {
  const secret = process.env.SECRET_JWT_KEY as string;
  const adminRole = Number(process.env.ID_ROL_ADMIN ?? "3");
  const nonAdminRole = adminRole === 1 ? 2 : 1;
  const token = jwt.sign({ id: 2, role: nonAdminRole, username: "user" }, secret, {
    expiresIn: "1h",
  });
  cookieHeader = `access_token=${token}`;
});

When("consulto el endpoint admin protegido", async function () {
  const req = request(app).get("/admin-only");
  response = cookieHeader ? await req.set("Cookie", cookieHeader) : await req;
});

Then("la respuesta debe ser {int}", function (statusCode: number) {
  expect(response.status).to.equal(statusCode);
});
