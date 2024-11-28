//backend/routes/videoRoutes.js
import { Router } from "express";
import { publishAVideo , getAllVideos , getAllUserVideos , deleteVideoById , VideoDataById , viewsIncrement } from "../controllers/videoController.js";
import { upload } from "../middlewares/multerMiddleware.js"
import {verifyJWT} from "../middlewares/authMiddleware.js"

const router = Router();


const videoUpload = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 },
  ]);

  router.route("/allVideo").get(getAllVideos)
  router.route("/videoData/:id").get(VideoDataById)
  router.use(verifyJWT); 


router.route("/publish").post(videoUpload , publishAVideo )
router.route("/allUserVideo/:owner").get(getAllUserVideos)
router.route("/delete/:id").delete(deleteVideoById)
router.route("/incrementView/:id").put(viewsIncrement)

export default router