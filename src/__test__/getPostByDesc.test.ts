import request from "supertest";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { closeDatabaseConnection } from "../database";
import { startServer } from "../server";
import {
    URL_SERVER,
    QUERY_CREATE_POST,
    QUERY_CREATE_USER,
    QUERY_DELETE_USER,
    QUERY_GET_BY_DESC,
} from "./__mocks__";


describe("POST IMAGE 👉 GET POST SORT BY DISLIKES", () => {
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
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: fake_token }).send(QUERY_GET_BY_DESC);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test("It should display an error if the token is not sent.", async () => {
        const { body } = await request(URL_SERVER).post("/").send(QUERY_GET_BY_DESC);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test("Deberia retornar lista de post", async() => {
        // TODO: create user
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        // TODO: create 2 posts
        QUERY_CREATE_POST.variables.variables.description = 'black blue post';
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);
        QUERY_CREATE_POST.variables.variables.description = 'blue post';
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);
        QUERY_CREATE_POST.variables.variables.description = 'orange post';
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);

        QUERY_GET_BY_DESC.variables.description = 'blue';
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_GET_BY_DESC);
        console.log(body)
        expect(body?.data.getPostByDesc).toHaveLength(2)

        // TODO: delete user created
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });

    test("Deberia retornar lista 0 post", async() => {
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;

        QUERY_GET_BY_DESC.variables.description = 'other';
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_GET_BY_DESC);
        
        expect(body?.data.getPostByDesc).toHaveLength(0)

        // TODO: delete user created
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });
});
