import * as userService from './service/user.service.js';
import {Router} from'express';
const userRouter = Router();

userRouter.post("/signup", userService.signUp);
userRouter.put("/update/:userId", userService.updateUser);
userRouter.delete("/delete/:userId", userService.deleteUser);
userRouter.get("/getAll", userService.ListUsers);
userRouter.post("/updatePassword", userService.updatePassword);

export default userRouter;