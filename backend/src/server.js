import cors from "cors";
import express, { json, urlencoded } from "express";
const app = express();
import { config } from "dotenv";
import ConnectionDB from "../config/Connection.js";
import routerKYC from "../routes/routes.js";

config();
app.use(json());
app.use(urlencoded({ extended: true }));

// Adjusted CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow both localhost and 127.0.0.1
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use("/", routerKYC);

app.get("/", (req, res) => {
  res.send("Welcome to my website");
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server Connected to the Port of ${PORT}`);
  ConnectionDB();
});
