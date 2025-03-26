import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/user.controller.ts";

const userRouter = new Router({
    prefix: "/api/users"
});

userRouter.get("/", getUsers); // GET /api/users
userRouter.post("/createUser", createUser); // POST /api/users/createUser
userRouter.get("/:id", getUserById); // GET /api/users/:id
userRouter.put("/edit/:id", updateUser); // PUT /api/users/edit/:id
userRouter.delete("/delete/:id", deleteUser); // DELETE /api/users/delete/:id

export { userRouter };