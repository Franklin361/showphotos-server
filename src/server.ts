import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { UserResolver, FavoriteResolver, PostResolver, CommentResolver } from "./resolver";
import { useServer } from 'graphql-ws/lib/use/ws';
import { getDecodedToken } from "./utils";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';

export async function startServer() {
  const { resolvers, typeDefs } = await buildTypeDefsAndResolvers({
    resolvers: [UserResolver, PostResolver, CommentResolver, FavoriteResolver],
  });

  const schema = makeExecutableSchema({typeDefs,resolvers});

  const app = express();
  const httpServer = createServer(app);
  app.use(cors());

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/"
  });
  
  const serverCleanup = useServer({ schema, onConnect: ()=>{ console.log('connect') } }, wsServer);

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      return {
        id_user_token: getDecodedToken(req),
      }
    },
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
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
  server.applyMiddleware({ app, path:'/' });


  return { app: httpServer, server };
}
