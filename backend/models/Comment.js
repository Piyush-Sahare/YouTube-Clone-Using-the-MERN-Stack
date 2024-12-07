// backend/models/Comment.js
import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema(
  {
    text: { type: String, required: true },
    userName: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userAvatar: { type: String },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  },
  { timestamps: true }
);


export const Comment = mongoose.model("Comment" , commentSchema)