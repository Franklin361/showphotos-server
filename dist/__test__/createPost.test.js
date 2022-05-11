"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const database_1 = require("../database");
const server_1 = require("../server");
const __mocks__1 = require("./__mocks__");
describe("POST IMAGE 👉 CREATE POST", () => {
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
    test('It should create the post image correctly', async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let id_user = res.body?.data.createUser.user.id;
        let token = res.body?.data.createUser.token;
        const { description, url_image } = __mocks__1.fake_post;
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_CREATE_POST);
        expect(body?.data.createPostImage.post.description).toBe(description);
        expect(body?.data.createPostImage.post.url_image).toBe(url_image);
        expect(body?.data.createPostImage.message).toBe('Creación de POST correcto');
        expect(body?.data.createPostImage.post.user.id).toBe(id_user);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
    test("It should display an error if the token is not valid.", async () => {
        let fake_token = "faketokenuser";
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: fake_token }).send(__mocks__1.QUERY_CREATE_POST);
        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });
    test("It should display an error if the token is not sent.", async () => {
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_POST);
        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });
    test("It should show an error if the user does not exist.", async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let id_user = res.body?.data.createUser.user.id;
        let token = res.body?.data.createUser.token;
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_CREATE_POST);
        expect(body?.errors[0].message).toBe('User no exists');
        expect(body?.data).toBeNull();
    });
    test("It should display the error because of a required field (description).", async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let id_user = res.body?.data.createUser.user.id;
        let token = res.body?.data.createUser.token;
        const prop = "description";
        __mocks__1.QUERY_CREATE_POST.variables.variables[prop] = null;
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_CREATE_POST);
        expect(body?.errors[0].message).toBe(`El campo ${prop} es obligatorio`);
        expect(body?.data).toBeNull();
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
});
//# sourceMappingURL=createPost.test.js.map