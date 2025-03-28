import { RouterContext } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Database } from "https://deno.land/x/mongo@v0.31.1/src/database.ts";
import { CreateUserInput, LoginUserInput } from "../DTO/user.dto.ts";

export const getUsers = async ({state, response}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        const users = await db.collection("users").find().toArray();

        response.body = users;
    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to fetch users"}
        console.error("Error in getUsers: ", err);
    }
}

export const getUserById = async ({state, response}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        const id: string = state.id;

        const user = await db.collection("users").findOne({
            _id: new ObjectId(id)
        });

        if(!user){
            response.status = 404;
            response.body = { error: "User not found" };
            return;
        }

        response.body = {
            user: user
        };
    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to fetch user"}
        console.error("Error in getUserById: ", err);
    }
}

export const createUser = async ({state, request, response}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        const { 
            firstName,
            lastName,
            email,
            password,
            birthday
        }: CreateUserInput = await request.body.json();

        const userExists = db.collection("users").find({email}); 

        if(userExists){
            response.status = 409;
            response.body = {
                status: "Failed",
                message: "Email already registered"
            };
            return;
        }

        const createdOn = new Date();
        const lastModified = createdOn;

        const userid = await db.collection("users").insertOne({
            firstName,
            lastName,
            email,
            password,
            birthday,
            createdOn,
            lastModified
        });

        if (!userid) {
            response.status = 500;
            response.body = { status: 'error', message: 'Error creating user' };
            return;
        }

    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to fetch users"}
        console.error("Error in getUsers: ", err);
    }
}