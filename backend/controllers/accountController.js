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
 * Utility function to generate access and refresh tokens for a user.
 * @param {string} userId - The ID of the user.
 * @returns {object} - An object containing accessToken and refreshToken.
 */
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // Fetch the user by ID
        const user = await newUser.findById(userId);

        // Generate tokens using user methods
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token to the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
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

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userfind._id);

    // Fetch user data without the refresh token field
    const loggedInUser = await newUser.findById(userfind._id).select("-refreshToken");

    // Set secure HTTP-only cookies for the tokens
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

/**
 * Logs out a user by clearing their refresh token and cookies.
 */
const logoutUser = asyncHandler(async (req, res) => {
    // Remove the refresh token from the user document
    console.log(req.body);
    await newUser.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    });

    // Clear the access and refresh token cookies
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

/**
 * Refreshes the access token using the provided refresh token.
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        // Retrieve the refresh token from cookies or request body
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify the refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );

        // Fetch the user associated with the token
        const user = await newUser.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid token");
        }

        // Validate the refresh token
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // Generate new tokens
        const { accessToken, newrefreshToken } = await generateAccessAndRefreshTokens(user._id);

        // Set the new tokens in cookies
        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refresh: newrefreshToken }, "Refresh token generated"));
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
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
    refreshAccessToken,
    getUserById,
    GetWatchHistory,
    addToWatchHistory
};
