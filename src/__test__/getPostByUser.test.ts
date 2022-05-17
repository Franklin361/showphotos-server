import request from "supertest";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { closeDatabaseConnection } from "../database";
import { startServer } from "../server";
import {
    URL_SERVER,
    QUERY_CREATE_POST,
    QUERY_CREATE_USER,
    QUERY_DELETE_USER,
    QUERY_GET_POST_BY_USER,
} from "./__mocks__";

describe("POST IMAGE 👉 GET POST BY USER", () => {
    let server: ApolloServer<ExpressContext>;

    jest.setTimeout(6000);

    beforeAll(async () => {
        const service = await startServer();
        server = service.server as ApolloServer<ExpressContext>;
    });

    afterAll(async () => {
        await closeDatabaseConnection();
        await server?.stop();
    });

    test("It should display an error if the token is not valid.", async () => {
        let fake_token = "faketokenuser";
        const { body } = await request(URL_SERVER)
            .post("/")
            .set({ Authorization: fake_token })
            .send(QUERY_GET_POST_BY_USER);

        expect(body?.errors[0].message).toBe(`Authentication not valid, please log in again. 🤯`);
        expect(body?.data).toBeNull();
    });

    test("It should display an error if the token is not sent.", async () => {
        const { body } = await request(URL_SERVER).post("/").send(QUERY_GET_POST_BY_USER);

        expect(body?.errors[0].message).toBe(`Authentication not valid, please log in again. 🤯`);
        expect(body?.data).toBeNull();
    });

    test("It should return 1 user posts.", async () => {
        // TODO: create user
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        let id_user = res.body?.data.createUser.user.id;

        // TODO: create post
        const post = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);
        let id_post = post.body?.data.createPostImage.post.id;

        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_GET_POST_BY_USER);

        expect(body?.data.getPostByUser).toHaveLength(1)
        expect(body?.data.getPostByUser[0].user.id).toBe(id_user)
        expect(body?.data.getPostByUser[0].id).toBe(id_post)

        // TODO: delete user created
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });

    test("It should return 0 user posts.", async () => {
        // TODO: create user
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;

        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_GET_POST_BY_USER);

        expect(body?.data.getPostByUser).toHaveLength(0)

        // TODO: delete user created
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });
});
