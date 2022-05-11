"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const ws_1 = require("ws");
const http_1 = require("http");
const resolver_1 = require("./resolver");
const ws_2 = require("graphql-ws/lib/use/ws");
const utils_1 = require("./utils");
const apollo_server_core_1 = require("apollo-server-core");
const schema_1 = require("@graphql-tools/schema");
async function startServer() {
    const { resolvers, typeDefs } = await (0, type_graphql_1.buildTypeDefsAndResolvers)({
        resolvers: [resolver_1.UserResolver, resolver_1.PostResolver, resolver_1.CommentResolver, resolver_1.FavoriteResolver],
    });
    const schema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers });
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    app.use((0, cors_1.default)());
    const wsServer = new ws_1.WebSocketServer({
        server: httpServer,
        path: "/"
    });
    const serverCleanup = (0, ws_2.useServer)({ schema, onConnect: () => { console.log('connect'); } }, wsServer);
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context: async ({ req }) => {
            return {
                id_user_token: (0, utils_1.getDecodedToken)(req),
            };
        },
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await server.start();
    server.applyMiddleware({ app, path: '/' });
    return { app: httpServer, server };
}
exports.startServer = startServer;
//# sourceMappingURL=server.js.map