import express from 'express';
// import validate from 'express-validation';
// import expressJwt from 'express-jwt';
// import paramValidation from '../../config/param-validation';
import { facebookStrategy } from '../strategies';
import { facebook as facebookCtrl } from '../controllers/auth.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/facebook')
  .get(facebookStrategy.authenticate('facebook', { failureRedirect: '/auth/facebook', scope: ['email', 'public_profile', 'user_about_me', 'user_work_history'] }));

router.route('/facebook/callback')
  .get(facebookStrategy.authenticate('facebook', { failureRedirect: '/login' }), facebookCtrl);

export default router;
