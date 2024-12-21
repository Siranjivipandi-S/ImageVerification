import express from "express";
import {
  uploadImages,
  fetchImages,
  UpdateStatusImage,
  GetimageByID,
} from "../controller/KYCController.js";

const routerKYC = express.Router();

routerKYC.post("/uploadImages", uploadImages);

// GET route to fetch images
routerKYC.get("/fetchImages", fetchImages);
routerKYC.get("/fetchImagesByid/:id", GetimageByID);
routerKYC.put("/updateImages/:id", UpdateStatusImage);
routerKYC.put("/updatefile/:file", UpdateStatusImage);

export default routerKYC;
