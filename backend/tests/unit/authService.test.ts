import { expect } from "chai";
import { describe, it } from "mocha";
import { comparePassword, encryptPassword } from "../../src/modules/auth/authService";

describe("authService", () => {
  it("debe generar un hash distinto al texto plano", async () => {
    const plain = "MiPasswordSegura123!";
    const hash = await encryptPassword(plain);

    expect(hash).to.be.a("string");
    expect(hash).to.not.equal(plain);
    expect(hash.length).to.be.greaterThan(20);
  });

  it("debe validar correctamente una contraseña válida", async () => {
    const plain = "ClaveValida456!";
    const hash = await encryptPassword(plain);

    const isValid = await comparePassword(plain, hash);
    expect(isValid).to.equal(true);
  });

  it("debe rechazar una contraseña inválida", async () => {
    const plain = "ClaveOriginal789!";
    const hash = await encryptPassword(plain);

    const isValid = await comparePassword("otra-clave", hash);
    expect(isValid).to.equal(false);
  });
});
