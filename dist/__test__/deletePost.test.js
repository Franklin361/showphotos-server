"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const database_1 = require("../database");
const server_1 = require("../server");
const __mocks__1 = require("./__mocks__");
describe("POST IMAGE 👉 DELETE POST", () => {
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
    test("It should delete the post correctly.", async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        const post = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_CREATE_POST);
        let id_post = post.body?.data.createPostImage.post.id;
        __mocks__1.QUERY_DELETE_POST.variables.deletePostImageId = `${id_post}`;
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_POST);
        expect(body?.data.deletePostImage.message).toBe('Post eliminado correctamente');
        const resd = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
        console.log(resd.body);
    });
    test("It should display an error if the token is not valid.", async () => {
        let fake_token = "faketokenuser";
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: fake_token }).send(__mocks__1.QUERY_DELETE_POST);
        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });
    test("It should display an error if the token is not sent.", async () => {
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_DELETE_POST);
        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });
    test('It should show an error if the post does not exist.', async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        let fake_id = 888;
        __mocks__1.QUERY_DELETE_POST.variables.deletePostImageId = `${fake_id}`;
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_POST);
        expect(body?.errors[0].message).toBe(`Post no exists`);
        expect(body?.data).toBeNull();
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
    test('It should display an error if you do not have deleting privileges.', async () => {
        const user1 = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let token_user1 = user1.body?.data.createUser.token;
        const post = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token_user1 }).send(__mocks__1.QUERY_CREATE_POST);
        let id_post = post.body?.data.createPostImage.post.id;
        __mocks__1.QUERY_CREATE_USER.variables.variables.email = 'test2@test2.com';
        const user2 = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let token_user2 = user2.body?.data.createUser.token;
        __mocks__1.QUERY_DELETE_POST.variables.deletePostImageId = `${id_post}`;
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token_user2 }).send(__mocks__1.QUERY_DELETE_POST);
        expect(body?.errors[0].message).toBe(`Tú no tienes privilegios para eliminar este Post`);
        expect(body?.data).toBeNull();
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token_user1 }).send(__mocks__1.QUERY_DELETE_USER);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token_user2 }).send(__mocks__1.QUERY_DELETE_USER);
    });
});
//# sourceMappingURL=deletePost.test.js.map