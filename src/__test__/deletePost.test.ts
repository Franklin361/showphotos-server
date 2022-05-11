import request from "supertest";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { closeDatabaseConnection } from "../database";
import { startServer } from "../server";
import { URL_SERVER, QUERY_CREATE_POST, QUERY_CREATE_USER, QUERY_DELETE_USER, QUERY_DELETE_POST } from "./__mocks__";


describe("POST IMAGE 👉 DELETE POST", () => {
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

    test("It should delete the post correctly.", async() => {
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;

        const post = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);
        let id_post = post.body?.data.createPostImage.post.id

        QUERY_DELETE_POST.variables.deletePostImageId = `${id_post}`
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_POST);

        expect(body?.data.deletePostImage.message).toBe('Post eliminado correctamente');

        const resd = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
        console.log(resd.body)
    });

    test("It should display an error if the token is not valid.", async() => {
        let fake_token = "faketokenuser";
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: fake_token }).send(QUERY_DELETE_POST);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test("It should display an error if the token is not sent.", async() => {
        const { body } = await request(URL_SERVER).post("/").send(QUERY_DELETE_POST);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test('It should show an error if the post does not exist.', async() => {
        // TODO: create user
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;

        // TODO: update post
        let fake_id = 888;
        QUERY_DELETE_POST.variables.deletePostImageId = `${fake_id}`;
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_POST);
        
        // TODO: to do expects
        expect(body?.errors[0].message).toBe(`Post no exists`);
        expect(body?.data).toBeNull();
        
        // TODO: delete user created
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    })

    test('It should display an error if you do not have deleting privileges.', async() => {
        // TODO: create user
        const user1 = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token_user1 = user1.body?.data.createUser.token;

        // TODO: create post by user 1
        const post = await request(URL_SERVER).post("/").set({ Authorization: token_user1 }).send(QUERY_CREATE_POST);
        let id_post = post.body?.data.createPostImage.post.id

        // TODO: create a second user.
        QUERY_CREATE_USER.variables.variables.email = 'test2@test2.com'
        const user2 = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token_user2 = user2.body?.data.createUser.token;
        
        // TODO: update post by user 2
        QUERY_DELETE_POST.variables.deletePostImageId = `${id_post}`;
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token_user2 }).send(QUERY_DELETE_POST);

        // TODO: to do expects
        expect(body?.errors[0].message).toBe(`Tú no tienes privilegios para eliminar este Post`);
        expect(body?.data).toBeNull();
        
        // TODO: delete user created
        
        await request(URL_SERVER).post("/").set({ Authorization: token_user1 }).send(QUERY_DELETE_USER);
        await request(URL_SERVER).post("/").set({ Authorization: token_user2 }).send(QUERY_DELETE_USER);
    })

});
