import request from "supertest";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { closeDatabaseConnection } from "../database";
import { startServer } from "../server";
import { QUERY_CREATE_USER, QUERY_DELETE_USER, fake_user, URL_SERVER } from "./__mocks__";

describe("USER 👉 CREATE USER", () => {
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

    test("it should create the user correctly.", async() => {
        // create user
        const { body } = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let id_user = body?.data.createUser.user.id;
        let token = body?.data.createUser.token;
        // to do expects
        expect(body?.data.createUser.message).toBe("Creación de usuario correcto");
        expect(body?.data.createUser.user.name).toBe(fake_user.name);
        expect(body?.data.createUser.user.email).toBe(fake_user.email);
        // delete user creted
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });

    test("It should display the error 'email already exists'.", async() => {
        // create a user 
        const { body } = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        let id_user = body?.data.createUser.user.id;
        let token = body?.data.createUser.token;
        
        // to try create user whit a email alrady exists
        const result = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);
        
        // to do expects
        expect(result.body?.errors[0].message).toBe("El email ya esta registrado");
        expect(result.body?.data).toBeNull();

        // delete user created
        
        await request(URL_SERVER).post("/").set({ Authorization: token }).send(QUERY_DELETE_USER);
    });

    test("It should display the error because of a required field (name).", async() => {
        // TODO: set undefined to name property
        const prop = 'name'
        QUERY_CREATE_USER.variables.variables[prop] = null!

        // TODO: to try create user whitout a input
        const { body } = await request(URL_SERVER).post("/").send(QUERY_CREATE_USER);

        // TODO: to do expects
        expect(body?.errors[0].message).toBe(`El campo ${prop} es obligatorio`);
        expect(body?.data).toBeNull();
    });

});
