"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const apollo_server_express_1 = require("apollo-server-express");
const database_1 = require("./database");
const server_1 = require("./server");
async function main() {
    try {
        (0, database_1.startDatabaseConnection)();
        const { app } = await (0, server_1.startServer)();
        const PORT = process.env.PORT || 3010;
        app.listen(PORT, () => console.log(`Listen on: http://localhost:${PORT} ✅`));
    }
    catch (e) {
        console.error(e);
        throw new apollo_server_express_1.ApolloError('Error internal server, please try later 🚨');
    }
}
main();
//# sourceMappingURL=index.js.map