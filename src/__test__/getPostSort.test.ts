import request from "supertest";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { closeDatabaseConnection } from "../database";
import { startServer } from "../server";
import {
    URL_SERVER,
    QUERY_CREATE_POST,
    QUERY_CREATE_USER,
    QUERY_DELETE_USER,
    QUERY_GET_SORT,
    QUERY_UPDATE_POST,
    QUERY_UPDATE_LIKES_POST
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
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: fake_token }).send(QUERY_GET_SORT);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test("It should display an error if the parameter is not correct.", async () => {
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;

        QUERY_GET_SORT.variables.typeSort = 'error-type';
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_GET_SORT);

        expect(body?.errors[0].message).toBe(`Type sort invalid`);
        expect(body?.data).toBeNull();

        // TODO: delete user created
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });

    test("It should display an error if the token is not sent.", async () => {
        const { body } = await request(URL_SERVER).post("/").send(QUERY_GET_SORT);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test("Deberia retornar lista de post ordernas por dislikes", async() => {
         // TODO: create user
         const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
         let token = res.body?.data.createUser.token;
         // TODO: create 2 posts
         const post1 = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST); //0 likes
         await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST); // 550 likes
 
         QUERY_UPDATE_LIKES_POST.variables.variables.id = `${post1.body?.data.createPostImage.post.id}`;
         QUERY_UPDATE_LIKES_POST.variables.variables.dislike = true
         QUERY_UPDATE_LIKES_POST.variables.variables.likes = false
 
         const postUpdated = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_UPDATE_LIKES_POST);
         const dislike = postUpdated.body.data.updateLikeDislikePostImage.dislike
         
         QUERY_GET_SORT.variables.typeSort = 'dislike';
         const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_GET_SORT);
         
         expect(body?.data.getPostSort).toHaveLength(2)
         expect(body?.data.getPostSort[0].dislike).toBe(dislike)
         expect(body?.data.getPostSort[1].dislike).toBe(post1.body?.data.createPostImage.post.dislike)
 
         // TODO: delete user created
         await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });

    test("Deberia retornar lista de post ordernas por likes", async() => {
        // TODO: create user
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;
        // TODO: create 2 posts
        const post1 = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST); //0 likes
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST); // 550 likes

        QUERY_UPDATE_LIKES_POST.variables.variables.id = `${post1.body?.data.createPostImage.post.id}`;
        QUERY_UPDATE_LIKES_POST.variables.variables.likes = true
        QUERY_UPDATE_LIKES_POST.variables.variables.dislike = false

        const postUpdated = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_UPDATE_LIKES_POST);
        const likes = postUpdated.body.data.updateLikeDislikePostImage.likes
        
        QUERY_GET_SORT.variables.typeSort = 'likes';
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_GET_SORT);
        
        expect(body?.data.getPostSort).toHaveLength(2)
        expect(body?.data.getPostSort[0].likes).toBe(likes)
        expect(body?.data.getPostSort[1].likes).toBe(post1.body?.data.createPostImage.post.likes)

        // TODO: delete user created
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });

    test("Deberia retornar lista 0 post", async() => {
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;

        QUERY_GET_SORT.variables.typeSort = 'likes';
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_GET_SORT);
        
        expect(body?.data.getPostSort).toHaveLength(0)

        // TODO: delete user created
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });
});
