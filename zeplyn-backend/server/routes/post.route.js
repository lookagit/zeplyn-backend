import express from 'express';
import validate from 'express-validation';
import postCtrl from '../controllers/post.controller';
import paramValidation from '../../config/param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/posts - Get list of posts */
  .get(postCtrl.list)

  /** POST /api/posts - Get list of posts */
  .post(validate(paramValidation.createPost), postCtrl.create);

router.route('/:postId')
  /** GET /api/posts/:postId - Get post */
  .get(postCtrl.get)

  /** PUT /api/posts/:postId - Update post */
  .put(validate(paramValidation.updatePost), postCtrl.update)

  /** DELETE /api/posts/:postId - Delete post */
  .delete(postCtrl.remove);

/** Load post when API with postId route parameter is hit */
router.param('postId', postCtrl.load);

export default router;
