import request from "supertest";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { closeDatabaseConnection } from "../database";
import { startServer } from "../server";
import { URL_SERVER, QUERY_CREATE_POST, QUERY_CREATE_USER, QUERY_DELETE_USER, QUERY_UPDATE_LIKES_POST } from "./__mocks__";

describe("POST IMAGE 👉 UPDATE LIKES POST", () => {
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
        const { body } = await request(URL_SERVER).post("/").set({ Authorization: fake_token }).send(QUERY_UPDATE_LIKES_POST);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test("It should display an error if the token is not sent.", async () => {
        const { body } = await request(URL_SERVER).post("/").send(QUERY_UPDATE_LIKES_POST);

        expect(body?.errors[0].message).toBe(`Autenticación no valida, vuelva a iniciar sesión`);
        expect(body?.data).toBeNull();
    });

    test('It should update likes of the post correctly', async() => {
        
        // create user
        const res = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let token = res.body?.data.createUser.token;

        // user - create post  
        const post = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_CREATE_POST);
        let id_post = post.body?.data.createPostImage.post.id;
        let post_likes = post.body?.data.createPostImage.post.likes;
        let post_dislike = post.body?.data.createPostImage.post.dislike;
        
        // update the likes of the post 
        QUERY_UPDATE_LIKES_POST.variables.variables.id = `${id_post}`;
        QUERY_UPDATE_LIKES_POST.variables.variables.likes = true

        const postUpdated = await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_UPDATE_LIKES_POST);

        const { body } = postUpdated;
        console.log(post.body)
        expect(body?.data.updateLikeDislikePostImage.likes).toBe(post_likes + 1);
        expect(body?.data.updateLikeDislikePostImage.dislike).toBe(post_dislike);

        // delete user
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    })

});
