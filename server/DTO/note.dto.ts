import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

export const createNoteDTO = z.object({
    body: z.object({
        note: z.string({required_error: "Note is required"}),
        createdOn: z.date(),
        lastModified: z.date()
    })
});

export type CreateNoteInput = z.TypeOf<typeof createNoteDTO>['body'];