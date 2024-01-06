import express from 'express';
import customerCtrl from '../controllers/customerCtrl.js';

const router = express.Router();

router.post('/login', customerCtrl.login);
router.post('/signup', customerCtrl.signup);
router.get("/refresh_token", customerCtrl.generateAccessToken);
router.get("/logout", customerCtrl.logout);



export default router;
