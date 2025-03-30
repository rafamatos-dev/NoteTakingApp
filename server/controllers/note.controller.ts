import { RouterContext } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { Database } from "https://deno.land/x/mongo@v0.31.1/src/database.ts";
import { CreateNoteInput } from "../DTO/note.dto.ts";

const getNotes = async ({state, response}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        const notes = await db.collection("notes").find().toArray();

        response.body = notes;
    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to fetch notes"}
        console.error("Error in getNotes: ", err);
    }
}

const getNoteById = async ({state, response}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        const id: string = state.id;

        const note = await db.collection("notes").findOne({
            _id: new ObjectId(id)
        });

        if(!note){
            response.status = 404;
            response.body = { error: "Note not found" };
            return;
        }

        response.body = {
            note: note
        };
    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to fetch note"}
        console.error("Error in getNoteById: ", err);
    }
}

const createNote = async ({state, request, response}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        // createdBy
        const { 
            note
        }: CreateNoteInput = await request.body.json();

        const createdOn = new Date();
        const lastModified = createdOn;

        const noteid = await db.collection("notes").insertOne({
            note,
            createdOn,
            lastModified,
            createdBy: new ObjectId()
        });

        if (!noteid) {
            response.status = 500;
            response.body = { status: 'error', message: 'Error creating note' };
            return;
        }

    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to create note"}
        console.error("Error in createNote: ", err);
    }
}

const updateNoteById = async ({state, request, response}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        const id: string = state.id;
        const { note } = await request.body.json();

        const updatedNote = await db.collection("notes").updateOne(
            { _id: new ObjectId(id) },
            { note }
        );

        if(updatedNote.modifiedCount == 0){
            response.status = 404;
            response.body = { error: "Note not found" };
            return;
        }

        response.body = {
            message: "Note updated"
        };
    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to update note"}
        console.error("Error in updateNoteById: ", err);
    }
}

const deleteNoteById = async ({state, response}: RouterContext<string>) => {
    try {
        const db: Database = state.db;
        const id: string = state.id;

        const deletedNote = await db.collection("notes").deleteOne({
            _id: new ObjectId(id)
        });

        if(!deletedNote){
            response.status = 404;
            response.body = { error: "Note not found" };
            return;
        }

        response.body = {
            message: "Note deleted"
        };
    } catch (err) {
        response.status = 500;
        response.body = { error: "Failed to delete note"}
        console.error("Error in deleteNoteById: ", err);
    }
}

export {
    getNotes,
    getNoteById,
    createNote,
    updateNoteById,
    deleteNoteById
}