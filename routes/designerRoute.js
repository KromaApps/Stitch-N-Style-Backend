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
  followDesigner,
} from "../controllers/designerController.js";
import authUser from "../middleware/auth.js";

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
designerRouter.put("/follow/:designerId", authUser, followDesigner);

export default designerRouter;
