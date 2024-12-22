import express from "express";
import {
  uploadImages,
  fetchImages,
  UpdateStatusImage,
  GetimageByID,
  updatedFile,
} from "../controller/KYCController.js";
import multer from "multer";

const routerKYC = express.Router();
const storage = multer.memoryStorage();
const uploads = multer({ storage });
// GET route to fetch images
routerKYC.get("/fetchImages", fetchImages);
routerKYC.get("/fetchImagesByid/:id", GetimageByID);
routerKYC.post("/uploadImages", uploadImages);
routerKYC.put("/updateImages/:id", UpdateStatusImage);
routerKYC.put("/updatefile", updatedFile);

export default routerKYC;
