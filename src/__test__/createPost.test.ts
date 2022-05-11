import request from "supertest";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { closeDatabaseConnection } from "../database";
import { startServer } from "../server";
import { URL_SERVER, QUERY_CREATE_POST, QUERY_CREATE_USER, QUERY_DELETE_USER, fake_post } from "./__mocks__";

describe("POST IMAGE 👉 CREATE POST", () => {
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

    test('It should create the post image correctly', async() => { 
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let id_user = res.body?.data.createUser.user.id;
        let token = res.body?.data.createUser.token;

        const { description, url_image } = fake_post;

        const { body } =await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);

        expect( body?.data.createPostImage.post.description).toBe(description)
        expect( body?.data.createPostImage.post.url_image).toBe(url_image)
        expect( body?.data.createPostImage.message).toBe('Creación de POST correcto')
        expect( body?.data.createPostImage.post.user.id).toBe(id_user)

        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    })

    test("It should display an error if the token is not valid.", async () => {
        let fake_token = "faketokenuser";
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: fake_token }).send(QUERY_CREATE_POST);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test("It should display an error if the token is not sent.", async () => {
        const { body } = await request(URL_SERVER).post("/").send(QUERY_CREATE_POST);
        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test("It should show an error if the user does not exist.", async () => {
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let id_user = res.body?.data.createUser.user.id;
        let token = res.body?.data.createUser.token;

        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);

        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);

        expect(body?.errors[0].message).toBe('User no exists');
        expect(body?.data).toBeNull();
    });

    test("It should display the error because of a required field (description).", async () => {
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let id_user = res.body?.data.createUser.user.id;
        let token = res.body?.data.createUser.token;

        // TODO: set undefined to name property
        const prop = "description";
        QUERY_CREATE_POST.variables.variables[prop] = null!;

        // TODO: to try create user whitout a input
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);

        // TODO: to do expects
        expect(body?.errors[0].message).toBe(`El campo ${prop} es obligatorio`);
        expect(body?.data).toBeNull();

        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });
});
