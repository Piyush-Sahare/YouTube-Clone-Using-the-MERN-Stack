import { Tag } from "../models/tagsModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a new tag
export const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ApiError(400, "Tag name is required");
    }

    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
        throw new ApiError(400, "Tag already exists");
    }

    const tag = await Tag.create({ name });

    res
        .status(201)
        .json(new ApiResponse(201, tag, "Tag created successfully"));
});

// Get all tags
export const getAllTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find();

    res
        .status(200)
        .json(new ApiResponse(200, tags, "Tags fetched successfully"));
});

// Delete a tag
export const deleteTag = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const tag = await Tag.findById(id);
    if (!tag) {
        throw new ApiError(404, "Tag not found");
    }

    await tag.deleteOne();

    res
        .status(200)
        .json(new ApiResponse(200, {}, "Tag deleted successfully"));
});
