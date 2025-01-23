import express from "express";
import {
  searchEntities,
  getSuggestions,
} from "../controllers/searchController.js";

const searchRouter = express.Router();

searchRouter.post("/", searchEntities);
searchRouter.post("/suggestions", getSuggestions);

export default searchRouter;
