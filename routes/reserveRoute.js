import express from "express";
import reserveCtrl from "../controllers/reserveCtrl.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.post("/create_reserve", auth, reserveCtrl.create);
router.delete("/delete_reserve", auth, reserveCtrl.delete);



export default router;