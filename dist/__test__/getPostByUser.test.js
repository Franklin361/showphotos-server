"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const database_1 = require("../database");
const server_1 = require("../server");
const __mocks__1 = require("./__mocks__");
describe("POST IMAGE 👉 GET POST BY USER", () => {
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
    test("It should display an error if the token is not valid.", async () => {
        let fake_token = "faketokenuser";
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER)
            .post("/")
            .set({ Authorization: fake_token })
            .send(__mocks__1.QUERY_GET_POST_BY_USER);
        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });
    test("It should display an error if the token is not sent.", async () => {
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_GET_POST_BY_USER);
        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });
    test("It should return 1 user posts.", async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        let id_user = res.body?.data.createUser.user.id;
        const post = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_CREATE_POST);
        let id_post = post.body?.data.createPostImage.post.id;
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_GET_POST_BY_USER);
        expect(body?.data.getPostByUser).toHaveLength(1);
        expect(body?.data.getPostByUser[0].user.id).toBe(id_user);
        expect(body?.data.getPostByUser[0].id).toBe(id_post);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
    test("It should return 0 user posts.", async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_GET_POST_BY_USER);
        expect(body?.data.getPostByUser).toHaveLength(0);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
});
//# sourceMappingURL=getPostByUser.test.js.map