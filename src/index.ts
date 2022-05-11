import "reflect-metadata";
import "dotenv/config";
import { ApolloError } from 'apollo-server-express';
import { startDatabaseConnection } from "./database";
import { startServer } from "./server";

async function main() {
    try {
        startDatabaseConnection();
        const { app } = await startServer();
        const PORT = process.env.PORT || 3010;
        app.listen(PORT, () => console.log(`Listen on: http://localhost:${PORT} ✅`));
    } catch (e) {
        console.error(e);
        throw new ApolloError('Error internal server, please try later 🚨')
    }
}

main();
