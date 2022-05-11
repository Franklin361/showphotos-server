import request from "supertest";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { closeDatabaseConnection } from "../database";
import { startServer } from "../server";
import { URL_SERVER, QUERY_CREATE_POST, QUERY_CREATE_USER, QUERY_DELETE_USER, QUERY_CREATE_COMMENT, fake_comment } from "./__mocks__";

describe("COMMENT 👉 CREATE COMMENT", () => {
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
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: fake_token }).send(QUERY_CREATE_COMMENT);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test("It should display an error if the token is not sent.", async () => {
        const { body } = await request(URL_SERVER).post("/").send(QUERY_CREATE_COMMENT);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test('It should create the one comment correctly', async() => { 
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let id_user = res.body?.data.createUser.user.id;
        let token = res.body?.data.createUser.token;

        const post = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);
        let id_post = post.body?.data.createPostImage.post.id

        QUERY_CREATE_COMMENT.variables.variables.id_post = `${id_post}`;
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_COMMENT);

        const { description } = fake_comment;

        expect(body?.data.createComment.comment.description).toBe(description)
        expect(body?.data.createComment.comment.post.id).toBe(id_post)
        expect(body?.data.createComment.comment.user.id).toBe(id_user)
        expect(body?.data.createComment.message).toBe('Comentario agregado correctamente')
        
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    })

    test("It should show an error if the post does not exist.", async() => {
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;

        let id_post = -1;
        QUERY_CREATE_COMMENT.variables.variables.id_post = `${id_post}`;

        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_COMMENT);

        expect(body?.errors[0].message).toBe(`Post no exists`);
        expect(body?.data).toBeNull();

        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });

    test("It should show an error if the user does not exist.", async() => {
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;

        const post = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);
        let id_post = post.body?.data.createPostImage.post.id

        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);

        QUERY_CREATE_COMMENT.variables.variables.id_post = `${id_post}`;

        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_COMMENT);

        expect(body?.errors[0].message).toBe(`User no exists`);
        expect(body?.data).toBeNull();

    });
});
