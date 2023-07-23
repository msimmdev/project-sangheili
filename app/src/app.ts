import express, { Request, Response } from "express";
import { Eta } from "eta";
import path from "path";
import router from "./routes";

const app = express();
const port = 3000;
const viewpath = path.join(__dirname, "views");
const eta = new Eta({ views: "/", debug: true, cache: true });

app.engine("eta", (filePath, options, callback) => {
  const rendered = eta.render(filePath, options);
  return callback(null, rendered);
});

app.set("views", viewpath);
app.set("view engine", "eta");

app.use("/", router);
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
