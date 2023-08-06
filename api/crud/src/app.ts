import express, { Request, Response } from "express";
import dishRouter from "./routes/dish";

const app = express();
const port = 3100;

app.use(express.json());

app.use("/dish", dishRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
