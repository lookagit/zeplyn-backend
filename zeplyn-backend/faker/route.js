import express from 'express';
import ctrl from './controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/createGroup')
  .get(ctrl.createFakeGroup);

router.route('/createEvent')
  .get(ctrl.createFakeEvent);

router.route('/createUser')
  .get(ctrl.create1FakeUser);

router.route('/create10User')
    .get(ctrl.create10FakeUser);

router.route('/create10BlockedUsers')
    .get(ctrl.create10BlockedUsers);

router.route('/createFriends')
    .get(ctrl.createFriends);

router.route('/joinGroup')
    .get(ctrl.joinGroup);

router.route('/createUserEvent')
   .get(ctrl.createUserEvent);

router.route('/removeUserEvent')
   .get(ctrl.removeUserEvent);

router.route('/removeUserFriend')
   .get(ctrl.removeUserFriend);

router.route('/unblockUser')
   .get(ctrl.unblockUser);

router.route('/updatePosition')
   .get(ctrl.updatePosition);

export default router;
