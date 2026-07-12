import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

const client = new MongoClient(MONGODB_URI);

let db;

export async function getDb() {
    if (!db) {
        await client.connect();
        db = client.db('mlclub'); // Database name
    }
    return db;

  
}