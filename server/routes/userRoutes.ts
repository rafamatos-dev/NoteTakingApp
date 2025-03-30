import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { createUser, getUsers, getUserById, updateUserById, deleteUserById } from "../controllers/user.controller.ts";

const userRouter = new Router({
    prefix: "/api/users"
});

userRouter.get("/", getUsers); // GET /api/users
userRouter.post("/createUser", createUser); // POST /api/users/createUser
userRouter.get("/:id", getUserById); // GET /api/users/:id
userRouter.put("/edit/:id", updateUserById); // PUT /api/users/edit/:id
userRouter.delete("/delete/:id", deleteUserById); // DELETE /api/users/delete/:id

export { userRouter };