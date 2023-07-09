import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  await res.render("index", { name: "Michael", title: "WoHoo!" });
});

export default router;
