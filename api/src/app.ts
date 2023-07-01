import express, { Express, Request, Response } from 'express';
import mongoUriBuilder from 'mongo-uri-builder';
import mongoose from 'mongoose';

const app: Express = express();
const port = 3000;
const mongoUri = mongoUriBuilder({
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  host: 'the-free-cookbook-mongo-1',
  port: 27017,
  database: 'test'
});

const testSchema = new mongoose.Schema({title: String});
const thing = mongoose.model('thing', testSchema);

console.log(mongoUri);

app.get('/', async (req: Request, res: Response) => {
  await mongoose.connect(mongoUri, { authSource: "admin" }); //asd
  const data = await thing.find()
  res.send(data);
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})