import "dotenv/config";
import express from "express";
import userRouter from "./modules/users/user.controller.js";
import dbConnection from "./DB/db.connection.js";

const app = express();
app.use(express.json());

dbConnection();
app.use("/api/users", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});
app.use((req, res) => {
  res.status(404).send("Not Found");
});
app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
