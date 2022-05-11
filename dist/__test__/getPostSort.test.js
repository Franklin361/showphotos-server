"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const database_1 = require("../database");
const server_1 = require("../server");
const __mocks__1 = require("./__mocks__");
describe("POST IMAGE 👉 GET POST SORT BY DISLIKES", () => {
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
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: fake_token }).send(__mocks__1.QUERY_GET_SORT);
        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });
    test("It should display an error if the parameter is not correct.", async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        __mocks__1.QUERY_GET_SORT.variables.typeSort = 'error-type';
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_GET_SORT);
        expect(body?.errors[0].message).toBe(`Type sort invalid`);
        expect(body?.data).toBeNull();
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
    test("It should display an error if the token is not sent.", async () => {
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_GET_SORT);
        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });
    test("Deberia retornar lista de post ordernas por dislikes", async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        const post1 = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_CREATE_POST);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_CREATE_POST);
        __mocks__1.QUERY_UPDATE_LIKES_POST.variables.variables.id = `${post1.body?.data.createPostImage.post.id}`;
        __mocks__1.QUERY_UPDATE_LIKES_POST.variables.variables.dislike = true;
        __mocks__1.QUERY_UPDATE_LIKES_POST.variables.variables.likes = false;
        const postUpdated = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_UPDATE_LIKES_POST);
        const dislike = postUpdated.body.data.updateLikeDislikePostImage.dislike;
        __mocks__1.QUERY_GET_SORT.variables.typeSort = 'dislike';
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_GET_SORT);
        expect(body?.data.getPostSort).toHaveLength(2);
        expect(body?.data.getPostSort[0].dislike).toBe(dislike);
        expect(body?.data.getPostSort[1].dislike).toBe(post1.body?.data.createPostImage.post.dislike);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
    test("Deberia retornar lista de post ordernas por likes", async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        const post1 = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_CREATE_POST);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_CREATE_POST);
        __mocks__1.QUERY_UPDATE_LIKES_POST.variables.variables.id = `${post1.body?.data.createPostImage.post.id}`;
        __mocks__1.QUERY_UPDATE_LIKES_POST.variables.variables.likes = true;
        __mocks__1.QUERY_UPDATE_LIKES_POST.variables.variables.dislike = false;
        const postUpdated = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_UPDATE_LIKES_POST);
        const likes = postUpdated.body.data.updateLikeDislikePostImage.likes;
        __mocks__1.QUERY_GET_SORT.variables.typeSort = 'likes';
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_GET_SORT);
        expect(body?.data.getPostSort).toHaveLength(2);
        expect(body?.data.getPostSort[0].likes).toBe(likes);
        expect(body?.data.getPostSort[1].likes).toBe(post1.body?.data.createPostImage.post.likes);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
    test("Deberia retornar lista 0 post", async () => {
        const res = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").send(__mocks__1.QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        __mocks__1.QUERY_GET_SORT.variables.typeSort = 'likes';
        const { body } = await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_GET_SORT);
        expect(body?.data.getPostSort).toHaveLength(0);
        await (0, supertest_1.default)(__mocks__1.URL_SERVER).post("/").set({ Authorization: token }).send(__mocks__1.QUERY_DELETE_USER);
    });
});
//# sourceMappingURL=getPostSort.test.js.map