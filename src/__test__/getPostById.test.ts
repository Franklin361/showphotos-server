import request from "supertest";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { closeDatabaseConnection } from "../database";
import { startServer } from "../server";
import {
    URL_SERVER,
    QUERY_CREATE_POST,
    QUERY_CREATE_USER,
    QUERY_DELETE_USER,
    QUERY_GET_POST_BY_ID,
    fake_post
} from "./__mocks__";

describe("POST IMAGE 👉 GET POST BY ID", () => {
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
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: fake_token }).send(QUERY_GET_POST_BY_ID);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test("It should display an error if the token is not sent.", async () => {
        const { body } = await request(URL_SERVER).post("/").send(QUERY_GET_POST_BY_ID);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
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

        QUERY_GET_POST_BY_ID.variables.getPostByIdId = `${id_post}`
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_GET_POST_BY_ID);

        const { description, url_image } = fake_post;
        console.log(body)
        expect(body?.data.getPostById.user.id).toBe(id_user)
        expect(body?.data.getPostById.id).toBe(id_post)
        expect(body?.data.getPostById.description).toBe(description)
        expect(body?.data.getPostById.url_image).toBe(url_image)

        // TODO: delete user created
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });

    test("It should show an error if the post does not exist.", async () => {
        // TODO: create user
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;

        let id_post = -1
        QUERY_GET_POST_BY_ID.variables.getPostByIdId = `${id_post}`
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_GET_POST_BY_ID);

        expect(body?.errors[0].message).toBe(`This post no exists`);
        expect(body?.data).toBeNull();

        // TODO: delete user created
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });
});
