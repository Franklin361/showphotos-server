import request from "supertest";
import { ApolloServer, ExpressContext } from "apollo-server-express";

import { closeDatabaseConnection } from "../database";
import { startServer } from "../server";

import { QUERY_CREATE_USER, QUERY_DELETE_USER, QUERY_LOGIN, URL_SERVER, fake_user } from "./__mocks__";

const { name, email } = fake_user;

describe("USER 👉 USER LOGIN", () => {
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

    test("It should show a successful login.", async () => {
        const { body } = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let id_user = body?.data.createUser.user.id;
        let token = body?.data.createUser.token;

        const result = await request(URL_SERVER).post("/").send(QUERY_LOGIN);

        expect(result.body?.data.login.message).toBe("Successful login ✅✅");
        expect(result.body?.data.login.user.email).toBe(email);
        expect(result.body?.data.login.user.name).toBe(name);
        expect(result.body?.data.login.user.id).toBe(id_user);

        
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });

    test("It should display a 'user does not exist' message.", async () => {
        const result = await request(URL_SERVER).post("/").send(QUERY_LOGIN);
        expect(result.body?.errors[0].message).toBe("User doesn't exist 🤨");
        expect(result.body?.data).toBeNull();
    });

    test("It should display a 'Password is incorrect' message.", async () => {
        const { body } = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let id_user = body?.data.createUser.user.id;
        let token = body?.data.createUser.token;

        QUERY_LOGIN.variables.variables.password = "incorrect password";
        const result = await request(URL_SERVER).post("/").send(QUERY_LOGIN);
        expect(result.body?.errors[0].message).toBe("The password is incorrect ❌");

        
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });
});
