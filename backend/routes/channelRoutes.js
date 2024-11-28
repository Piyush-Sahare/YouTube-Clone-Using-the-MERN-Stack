//backend/routes/channelRoutes.js
import { Router } from "express";
import { createChannel,getChannel,updateChannel,deleteChannel
} from "../controllers/channelController.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Route to create a channel
router.route("/create").post(verifyJWT,createChannel);
router.route("/data/:id").get(getChannel);
router.route("/update/:id").put(upload.single("banner"),updateChannel);
router.route("/delete/:id").delete(verifyJWT,deleteChannel);



export default router;
