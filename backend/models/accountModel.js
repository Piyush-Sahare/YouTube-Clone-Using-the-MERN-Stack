//backend/models/accountModel.js
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";


const userSignUp = new Schema(
    {
        name: {
            type: String,
            requiered: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            requiered: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            requiered: true
        },
        avatar: {
            type: String
        },
        hasChannel: {
            type: Boolean,
            default: false,
        },
        channelId:
        {
            type: Schema.Types.ObjectId,
            ref: "channel"
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "video"
            }
        ],
    },
    {
        timestamps: true
    }
)


// Method to compare the entered password with the stored password
userSignUp.methods.isPasswordCorrect = async function (password) {
    // In a real application, you should hash the input password and compare it to the stored hashed password
    return this.password === password;
};

userSignUp.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const newUser = mongoose.model("newUser", userSignUp)