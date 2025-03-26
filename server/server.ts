import { Application } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { masterRouter, userRouter, noteRouter } from "./routes/masterRouter.ts";
import "jsr:@std/dotenv/load";
import { dbMiddleware } from "./middlewares/db.middleware.ts";
import { connect, disconnect } from "./database.ts";

const app: Application = new Application();

// logger middleware
app.use(async (ctx, next) => {
  await next();
  const responseTime = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url.pathname} - ${responseTime}`);
});

// timing middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
})

// error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error: any) {
    ctx.response.status = 500;
    ctx.response.body = {error: error.message};
    console.log(`Error: ${error.message}`)
  }
});

// database connection middleware
app.use(dbMiddleware);

// routing
app.use(masterRouter.routes());
app.use(masterRouter.allowedMethods());

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(noteRouter.routes());
app.use(noteRouter.allowedMethods());

// server shutdown handler
Deno.addSignalListener("SIGINT", async () => {
  console.log("Shutting down server...");
  await disconnect();
  Deno.exit();
});

// connect to database
await connect();

// start server
try{
  await app.listen({
    port: Number(Deno.env.get("PORT"))
  })
} catch (err){
  console.error("Server error: ", err);
  await disconnect();
}


