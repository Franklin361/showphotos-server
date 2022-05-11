"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const database_1 = require("../database");
const server_1 = require("../server");
const __mocks__1 = require("./__mocks__");
const { name, email } = __mocks__1.fake_user;
describe("USER 👉 USER LOGIN", () => {
    let server;
    jest.setTimeout(6000);
    beforeAll(async () => {
        const service = await (0, server_1.startServer)();
        server = service.server;
    });
    afterAll(async () => {
        await (0, database_1.closeDatabaseConnection)();
        await server?.stop();
    });
    test("It should show a successful login.", async () => {
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let id_user = body?.data.createUser.user.id;
        let token = body?.data.createUser.token;
        const result = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_LOGIN);
        expect(result.body?.data.login.message).toBe("Inicio de sesión exitoso");
        expect(result.body?.data.login.user.email).toBe(email);
        expect(result.body?.data.login.user.name).toBe(name);
        expect(result.body?.data.login.user.id).toBe(id_user);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
    test("It should display a 'user does not exist' message.", async () => {
        const result = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_LOGIN);
        expect(result.body?.errors[0].message).toBe("El usuario no existe");
        expect(result.body?.data).toBeNull();
    });
    test("It should display a 'Password is incorrect' message.", async () => {
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let id_user = body?.data.createUser.user.id;
        let token = body?.data.createUser.token;
        __mocks__1.QUERY_LOGIN.variables.variables.password = "incorrect password";
        const result = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_LOGIN);
        expect(result.body?.errors[0].message).toBe("La contraseña es incorrecta");
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
});
//# sourceMappingURL=login.test.js.map