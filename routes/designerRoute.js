import express from "express";
import multer from "multer";
import {
  designerLogin,
  designerRegistration,
} from "../controllers/userController.js";
import {
  // addDesigner,
  // listDesigners,
  listTopDesigners,
  getDesignerDetails,
  updateDesignerProfile,
} from "../controllers/designerController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const designerRouter = express.Router();

designerRouter.post("/login", designerLogin);
designerRouter.post("/register", designerRegistration);
designerRouter.get("/top-designers", listTopDesigners);
// designerRouter.post("/add", upload.single("image"), addDesigner);
// designerRouter.get("/list", listDesigners);
designerRouter.get("/:id", getDesignerDetails);
designerRouter.put("/:id", updateDesignerProfile);

export default designerRouter;
