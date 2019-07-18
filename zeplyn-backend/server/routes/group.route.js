import express from 'express';
import validate from 'express-validation';
import groupCtrl from '../controllers/group.controller';
import paramValidation from '../../config/param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/groups - Get list of groups */
  .get(groupCtrl.list)

  /** POST /api/groups - Get list of groups */
  .post(validate(paramValidation.createGroup), groupCtrl.create);

router.route('/:groupId')
  /** GET /api/groups/:groupId - Get group */
  .get(groupCtrl.get)

  /** PUT /api/groups/:groupId - Update group */
  .put(validate(paramValidation.updateGroup), groupCtrl.update)

  /** DELETE /api/events/:groupId - Delete group */
  .delete(groupCtrl.remove);

/** Load group when API with groupId route parameter is hit */
router.param('groupId', groupCtrl.load);

export default router;
