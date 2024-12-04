// backend/routes/commentsRoutes.js
import express from 'express';
import {
  getCommentsByVideoId,
  addComment,
  deleteComment,
  updateComment,
} from '../controllers/commentsController.js';
import {verifyJWT} from "../middlewares/authMiddleware.js"

const router = express.Router();

// Routes for comments
router.get('/video/:videoId', getCommentsByVideoId);
router.post('/video/:videoId',verifyJWT, addComment);
router.delete('/:commentId',verifyJWT, deleteComment);
router.put('/:commentId',verifyJWT, updateComment);

export default router;
