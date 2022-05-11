"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const database_1 = require("../database");
const server_1 = require("../server");
const __mocks__1 = require("./__mocks__");
describe("USER 👉 CREATE USER", () => {
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
    test("it should create the user correctly.", async () => {
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let id_user = body?.data.createUser.user.id;
        let token = body?.data.createUser.token;
        expect(body?.data.createUser.message).toBe("Creación de usuario correcto");
        expect(body?.data.createUser.user.name).toBe(__mocks__1.fake_user.name);
        expect(body?.data.createUser.user.email).toBe(__mocks__1.fake_user.email);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
    test("It should display the error 'email already exists'.", async () => {
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let id_user = body?.data.createUser.user.id;
        let token = body?.data.createUser.token;
        const result = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        expect(result.body?.errors[0].message).toBe("El email ya esta registrado");
        expect(result.body?.data).toBeNull();
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
    test("It should display the error because of a required field (name).", async () => {
        const prop = 'name';
        __mocks__1.QUERY_CREATE_USER.variables.variables[prop] = null;
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        expect(body?.errors[0].message).toBe(`El campo ${prop} es obligatorio`);
        expect(body?.data).toBeNull();
    });
});
//# sourceMappingURL=createUser.test.js.map