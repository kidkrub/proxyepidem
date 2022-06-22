import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import https from "https";

const app = express();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(
  cors({
    origin: process.env.ALLOWED_HOST ? process.env.ALLOWED_HOST : "*",
  })
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.send("Server is running");
});

app.get("/epidem/api/*", async (req: Request, res: Response) => {
  let url = `https://epidemcenter.moph.go.th${req.originalUrl}`;
  console.log(url);
  const result = await axios.get(url);
  res.json(result.data);
});

app.post("/epidem/api/*", async (req: Request, res: Response) => {
  let url = `https://epidemcenter.moph.go.th${req.originalUrl}`;
  console.log(url);
  let headers = {
    authorization: req.headers.authorization ? req.headers.authorization : "",
  };
  let result;
  try {
    result = await axios.post(url, req.body, { headers: headers });
  } catch (error: any) {
    // console.log(error);
    res
      .status(parseInt(error.response.data.MessageCode))
      .send(error.response.data);
  }
  if (result) {
    res.send(result.data);
  }
});

app.get("/token", async (req: Request, res: Response) => {
  let url = `https://cvp1.moph.go.th${req.originalUrl}`;
  let result;
  console.log(url);
  try {
    result = await axios.get(url, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
  } catch (error: any) {
    res.status(parseInt(error.response.data.code)).send(error.response.data);
  }
  if (result) {
    res.send(result.data);
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server ready at port ${port}`);
});
