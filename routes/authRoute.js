import express from 'express';
import customerCtrl from '../controllers/customerCtrl.js';

const router = express.Router();

router.post('/login', customerCtrl.login);
router.post('/signup', customerCtrl.signup);
router.post("/logout", customerCtrl.logout);
router.get("/refresh_token", customerCtrl.generateAccessToken);



export default router;
