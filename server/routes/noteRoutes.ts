import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { getNotes, createNote, updateNoteById, deleteNoteById } from "../controllers/note.controller.ts";

const noteRouter = new Router({
  prefix: "/api/notes",
});

noteRouter.get("/", getNotes); // GET /api/notes
noteRouter.post("/createNote", createNote); // POST /api/notes/createNote
// noteRouter.get("/user/:id", getUserNotes); // GET /api/notes/user/:id
noteRouter.put("/edit/:id", updateNoteById); // PUT /api/notes/edit/:id
noteRouter.delete("/delete/:id", deleteNoteById); // DELETE /api/notes/delete/:id

export { noteRouter };