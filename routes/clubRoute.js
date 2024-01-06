import clubCtrl from '../controllers/clubCtrl.js';
import express from 'express';

const clubRouter = express.Router();

clubRouter.post('/create_club', clubCtrl.create);
clubRouter.get('/clubs', clubCtrl.get_clubs);

export default clubRouter;
