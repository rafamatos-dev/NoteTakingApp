import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { db } from "../database.ts"

interface NoteSchema {
    _id?: ObjectId,
    note: string
    createdOn: Date,
    createdBy: ObjectId,
    lastModified: Date,
}

export const Note = db?.collection<NoteSchema>("notes");