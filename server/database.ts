import { MongoClient, Database } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import "jsr:@std/dotenv/load";

export let db: Database | null = null;
let client: MongoClient | null = null;

export async function connect() {
    if(db)
        return db;

    if(!client){
        client = new MongoClient();
        console.log("Connecting to MongoDB...");
        
        const connectionString = Deno.env.get("DEV_CONNECTION_STRING") || "";
        console.log(`Using connection string: ${connectionString}`);
        
        await client.connect(connectionString);

        if(client.buildInfo?.ok)
            console.log("Connected to MongoDB...");
    }

    const dbName = Deno.env.get("DB_NAME") || "";
    console.log(`Using database: ${dbName}`);
    db = client.database(dbName);
    return db;
};

export async function disconnect() {
    if(client){
        await client.close();
        client = null;
        db = null;
        console.log("Disconnected from MongoDB");
    }
};

export function getDB(){
    if(!db){
        throw new Error("Database connection not established");
    }

    return db;
};

export function getCollection(name: string){
    return getDB().collection(name);
};