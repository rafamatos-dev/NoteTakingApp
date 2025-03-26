import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { db } from "../database.ts";

export interface UserSchema {
    _id?: ObjectId,
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    birthday: Date,
    createdOn: Date,
    lastModified: Date,
}

export const User = db?.collection<UserSchema>("users");