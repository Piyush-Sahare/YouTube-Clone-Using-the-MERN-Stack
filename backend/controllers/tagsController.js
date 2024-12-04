// backend/controllers/tagsController.js
import { Tag } from "../models/tagsModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Tag name is required" });
    }

    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
        return res.status(400).json({ error: "Tag already exists" });
    }

    const tag = await Tag.create({ name });
    res.status(201).json(tag);
});

export const getAllTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find();
    res.status(200).json(tags);
    //console.log(res);
});

export const deleteTag = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Tag.findByIdAndDelete(id);
    res.status(204).json({ message: "Tag deleted successfully" });

});
