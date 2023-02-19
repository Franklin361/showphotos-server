import { DataSource } from 'typeorm';
import path from 'path';
import { ApolloError } from 'apollo-server-express';

export const PostgresDataSource = new DataSource({
    type: 'postgres',
    entities: [
        path.join(__dirname, '../entity/**/**.ts'),
        path.join(__dirname, '../../dist/entity/*.js')
    ],
    synchronize: true
})

export async function startDatabaseConnection() {

    try {
        let url = process.env.DATABASE_URL;
        const database = PostgresDataSource.setOptions({ url })

        await database.initialize();

        console.log('Data Source has been initialized! 🥳')
    } catch (e) {
        const error = e as Error;
        console.error("Error during Data Source initialization 🚨", error.message);
        throw new ApolloError('Error connection to database, please try later')
    }
}

export async function closeDatabaseConnection() {
    try {
        if (PostgresDataSource.isInitialized) {
            await PostgresDataSource.destroy();
        }
    } catch (e) {
        const error = e as Error;
        console.error("Error, it can't destroy conncetion to database 🚨", error.message);
        throw new ApolloError('Error close connection to database, please try later')
    }
}