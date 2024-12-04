// backend/routes/tagsRoutes.js
import express from "express";
import {
    createTag,
    getAllTags,
    deleteTag,
} from "../controllers/tagsController.js";

const router = express.Router();

router.post("/createTags", createTag);
router.get("/getTags", getAllTags);
router.delete("/deleteTags/:id", deleteTag);

export default router;
