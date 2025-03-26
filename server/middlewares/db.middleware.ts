import { Context, Next } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { connect, getDB } from "../database.ts";

export async function dbMiddleware(ctx: Context, next: Next){
    await connect();

    ctx.state.db = getDB();

    await next();
}