import { newUser } from "../models/accountModel.js"; 
import { Video } from "../models/videoModel.js"; 
import { Comment } from "../models/Comment.js";
import { Channel } from "../models/channelModel.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { ApiError } from "../utils/ApiError.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 


const generateAccessToken = async (userId) => {
    try {
        const user = await newUser.findById(userId);
        const accessToken = user.generateAccessToken();
        await user.save({ validateBeforeSave: false });
        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating  access token");
    }
};

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const checkUser = await newUser.findOne({ $or: [{ name }, { email }] });

    if (checkUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const avatar = "https://res.cloudinary.com/dpdwl1tsu/image/upload/v1733578739/egt2sufg3qzyn1ofws9t_xvfn00.jpg";

    const user = await newUser.create({ name, email, password, avatar });

    return res.status(201).json(new ApiResponse(200, user, "User created successfully"));
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const userfind = await newUser.findOne({ email });
    if (!userfind) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await userfind.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password");
    }

    const { accessToken } = await generateAccessToken(userfind._id);
    const loggedInUser = await newUser.findById(userfind._id).select('-password');
    console.log(loggedInUser);

    const options = { httpOnly: true, secure: true };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "User logged in successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
    const options = { httpOnly: true, secure: true };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

export const updateAccount = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    let avatarName;
    if (req.file) {
        const avatarLocalPath = req.file.path;
        avatarName = await uploadOnCloudinary(avatarLocalPath);
    }

    const updateData = { name, email, password };
    if (avatarName) {
        updateData.avatar = avatarName.url;
    }

    const user = await newUser.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await newUser.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User data retrieved successfully"));
});



export const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await newUser.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.channelId) {
        const channelId = user.channelId;
        const channelVideos = await Video.find({ channelId }).select('_id');
        const videoIds = channelVideos.map(video => video._id);

        await Video.deleteMany({ channelId });

        if (videoIds.length > 0) {
            await newUser.updateMany(
                { likes: { $in: videoIds } },
                { $pull: { likes: { $in: videoIds } } }
            );
        }

        await newUser.updateMany(
            { subscriptions: channelId },
            { $pull: { subscriptions: channelId } }
        );

        await Channel.findByIdAndDelete(channelId);
    }

    if (user.subscriptions && user.subscriptions.length > 0) {
        await Channel.updateMany(
            { _id: { $in: user.subscriptions } },
            { $pull: { subscribers: userId } }
        );
    }

    await Video.deleteMany({ owner: userId });
    await Comment.deleteMany({ userId });

    await Video.updateMany(
        { likes: userId },
        { $pull: { likes: userId } }
    );

    await user.deleteOne();

    res.status(200).json(new ApiResponse(200, {}, "Account and associated data deleted successfully"));
});


