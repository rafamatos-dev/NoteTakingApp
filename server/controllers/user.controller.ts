import { RouterContext } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { Database } from "https://deno.land/x/mongo@v0.31.1/src/database.ts";
import { CreateUserInput, LoginUserInput } from "../DTO/user.dto.ts";

const getUsers = async ({state, response}: RouterContext<string>) => {
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

const getUserById = async ({state, response}: RouterContext<string>) => {
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

const createUser = async ({state, request, response}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        const { 
            firstName,
            lastName,
            email,
            password,
            birthday
        }: CreateUserInput = await request.body.json();

        const userExists = await db.collection("users").findOne({email: email});

        if(userExists !== undefined){
            response.status = 409;
            response.body = {
                status: "warning",
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

        response.status = 200;
        response.body = {
            _id: userid,
            message: "User created succesfully",
            status: "success"
        }

    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to create user"}
        console.error("Error in createUser: ", err);
    }
}

const updateUserById = async ({state, response, request}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        const id: string = state.id;

        const { 
            firstName,
            lastName,
            email,
            password,
            birthday
        }: CreateUserInput = await request.body.json();

        const user = await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            {
                firstName: firstName,
                lastName: lastName,
                password: password,
                birthday: birthday
            }
        );

        if(user.modifiedCount == 0){
            response.status = 404;
            response.body = { error: "User not found" };
            return;
        }

        response.body = {
            user: user
        };
    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to update user"}
        console.error("Error in updateUserById: ", err);
    }
}

const deleteUserById = async ({state, response}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        const id: string = state.id;

        const deletedUser = await db.collection("users").deleteOne({
            _id: new ObjectId(id)
        });

        if(!deletedUser){
            response.status = 404;
            response.body = { error: "User not found" };
            return;
        }

        response.body = {
            message: "User deleted"
        };
    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to delete user"}
        console.error("Error in deleteUserById: ", err);
    }
}

export {
    createUser,
    getUserById,
    getUsers,
    updateUserById,
    deleteUserById
}