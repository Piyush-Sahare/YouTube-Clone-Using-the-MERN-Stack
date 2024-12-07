// backend/models/channelModel.js
import mongoose, { Schema } from "mongoose";

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    banner: {
      type: String,
    },
    avatar: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "newUser",
      required: true,
    },
    subscribers: [
      {
        type: Schema.Types.ObjectId,
        ref: "newUser"
      }
    ],
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  {
    timestamps: true,
  }
);

export const Channel = mongoose.model("Channel", channelSchema);
