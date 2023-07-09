import express, { Request, Response } from 'express';

const app = express();
const port = 3000;
const mongoUri = process.env.MONGO_CONNECTION_STRING;

console.log(mongoUri);

if (typeof mongoUri === "string") {

  app.get('/', async (req: Request, res: Response) => {
    res.send([]);
  })

  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
} else {
  throw new Error("Undefined environment variable MONGO_CONNECTION_STRING");
}