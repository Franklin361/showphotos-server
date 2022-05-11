"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabaseConnection = exports.startDatabaseConnection = exports.PostgresDataSource = void 0;
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const apollo_server_express_1 = require("apollo-server-express");
exports.PostgresDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    entities: [
        path_1.default.join(__dirname, '../entity/**/**.ts'),
        path_1.default.join(__dirname, '../../dist/entity/*.js')
    ],
    synchronize: true
});
async function startDatabaseConnection() {
    try {
        let url = process.env.NODE_ENV === 'development' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;
        const database = exports.PostgresDataSource.setOptions({ url });
        await database.initialize();
        console.log('Data Source has been initialized! 🥳');
    }
    catch (e) {
        const error = e;
        console.error("Error during Data Source initialization 🚨", error.message);
        throw new apollo_server_express_1.ApolloError('Error connection to database, please try later');
    }
}
exports.startDatabaseConnection = startDatabaseConnection;
async function closeDatabaseConnection() {
    try {
        if (exports.PostgresDataSource.isInitialized) {
            await exports.PostgresDataSource.destroy();
        }
    }
    catch (e) {
        const error = e;
        console.error("Error, it can't destroy conncetion to database 🚨", error.message);
        throw new apollo_server_express_1.ApolloError('Error close connection to database, please try later');
    }
}
exports.closeDatabaseConnection = closeDatabaseConnection;
//# sourceMappingURL=config.js.map