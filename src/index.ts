import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import https from "https";

const app = express();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(
  cors({
    origin: ["http://localhost:4200", "https://epidem-clr.firebaseapp.com/"],
  })
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.send("Server is running");
});

app.get("/epidem/api/LookupTable", async (req: Request, res: Response) => {
  let result;
  if (req.query.table_name) {
    result = await axios.get(
      `https://epidemcenter.moph.go.th/epidem/api/LookupTable?table_name=${req.query.table_name}`
    );
  } else {
    result = await axios.get(
      "https://epidemcenter.moph.go.th/epidem/api/LookupTable"
    );
  }

  res.json(result.data);
});

app.get("/token", async (req: Request, res: Response) => {
  let url = "https://cvp1.moph.go.th/token?";
  let result;
  for (const [key, value] of Object.entries(req.query)) {
    url += `&${key}=${value}`;
  }
  url = url.replace(/&/, "");
  console.log(url);
  result = await axios
    .get(url, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })
    .catch((err) => {
      console.log(err);
      res.status(parseInt(err.response.data.code)).send(err.response.data);
    });
  if (result) {
    res.send(result.data);
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server ready at port ${port}`);
});
