//backend/controllers/accountController.js
import { newUser } from "../models/accountModel.js"; 
import { Video } from "../models/videoModel.js"; 
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { ApiError } from "../utils/ApiError.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 
import jwt from "jsonwebtoken"; 
import mongoose from "mongoose"; 

/**
 * Utility function to generate access token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {object} - An object containing accessToken .
 */
const generateAccessToken = async (userId) => {
    try {
        // Fetch the user by ID
        const user = await newUser.findById(userId);

        // Generate tokens using user methods
        const accessToken = user.generateAccessToken();
        
        await user.save({ validateBeforeSave: false });

        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating  access token");
    }
};

/**
 * Registers a new user.
 * Validates input fields, checks for duplicate users, and creates a new user.
 */
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if a user with the same name or email already exists
    const checkUser = await newUser.findOne({
        $or: [{ name }, { email }]
    });

    if (checkUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Assign a default avatar
    const avatar = "https://res.cloudinary.com/drr9bsrar/image/upload/v1716498256/egt2sufg3qzyn1ofws9t.jpg";

    // Create a new user record
    const user = await newUser.create({
        name,
        email,
        password,
        avatar
    });

    // Respond with success
    return res.status(201).json(new ApiResponse(200, user, "User created successfully"));
});

/**
 * Logs in an existing user.
 * Validates credentials, generates tokens, and stores them as HTTP-only cookies.
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the user exists in the database
    const userfind = await newUser.findOne({ email });
    if (!userfind) {
        throw new ApiError(404, "User does not exist");
    }

    // Validate password using a method from the model
    const isPasswordValid = await userfind.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password");
    }

    // Generate access tokens
    const { accessToken } = await generateAccessToken(userfind._id);

    // Fetch user data 
    const loggedInUser = await newUser.findById(userfind._id);

    // Set secure HTTP-only cookies for the tokens
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken}, "User logged in successfully"));
});

/**
 * Logs out a user 
 */
const logoutUser = asyncHandler(async (req, res) => {
   
    console.log(req.body);
   

    // Clear the access  token cookies
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

/**
 * Updates user account details, including name, email, password, and avatar.
 */
const updateAccount = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Upload avatar to Cloudinary if provided
    let avatarName;
    if (req.file) {
        const avatarLocalPath = req.file.path;
        avatarName = await uploadOnCloudinary(avatarLocalPath);
    }

    // Prepare the data to update
    const updateData = {
        name,
        email,
        password
    };

    if (avatarName) {
        updateData.avatar = avatarName.url; // Set the new avatar URL if uploaded
    }

    // Update the user document in the database
    const user = await newUser.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true } // Return the updated document
    );

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

/**
 * Deletes a user account by ID.
 */
const deleteAccount = asyncHandler(async (req, res) => {
    const user = await newUser.findByIdAndDelete(req.params.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json({
        success: true,
        message: "Account deleted successfully"
    });
});

/**
 * Fetches user data by their ID.
 */
const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Find the user by ID
    const user = await newUser.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User data retrieved successfully"));
});

/**
 * Retrieves the watch history of a user with video and owner details.
 */
const GetWatchHistory = asyncHandler(async (req, res) => {
    const user = await newUser.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos", // Join with the "videos" collection
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "newusers", // Join with the "newusers" collection
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: { // Fetch only the necessary fields
                                        name: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" } // Include the owner details
                        }
                    }
                ]
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch history fetched successfully"
            )
        );
});

/**
 * Adds a video to the user's watch history.
 */
const addToWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    // Validate the video ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Find the video by ID
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Find the user by ID
    const user = await newUser.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Add the video to the watch history if not already present
    if (!user.watchHistory.includes(id)) {
        user.watchHistory.push(id);
        await user.save();
    }

    return res.status(200).json(new ApiResponse(200, user.watchHistory, "Video added to watch history successfully"));
});

// Export all the controller functions
export {
    registerUser,
    login,
    updateAccount,
    deleteAccount,
    logoutUser,
    getUserById,
    GetWatchHistory,
    addToWatchHistory
};
