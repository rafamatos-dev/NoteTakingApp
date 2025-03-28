import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { noteRouter } from "./noteRoutes.ts";
import { userRouter } from "./userRoutes.ts";

const masterRouter = new Router();

masterRouter.get("/", (ctx) => {
    ctx.response.body = { message: "welcome to the API" };
});

export { masterRouter, userRouter, noteRouter };