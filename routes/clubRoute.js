import clubCtrl from '../controllers/clubCtrl.js';
import express from 'express';

const clubRouter = express.Router();

clubRouter.post('/create_club', clubCtrl.create);
clubRouter.get('/clubs', clubCtrl.get_clubs);
clubRouter.get('/club/:clubId', clubCtrl.get_club);

export default clubRouter;
