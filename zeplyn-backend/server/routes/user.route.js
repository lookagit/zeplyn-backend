import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId/find-friends')

  /** GET /api/users/:userId/find-friends find all users friends */
 .get(userCtrl.getUserFriends);

router.route('/:userId/user-search-posts/:queryString')

  /** GET /api/users/:userId/user-search-posts/:queryString search posts by queryString */
  .get(userCtrl.userPostSearch);

router.route('/:userId/user-search-groups/:queryString')
  .get(userCtrl.userGroupSearch);

router.route('/:userId/user-search-events/:queryString')
  .get(userCtrl.userEventSearch);

router.route('/:userId/user-like-post/:postId')
  .get(userCtrl.userLikePost);

router.route('/:userId/user-unlike-post/:postId')
  .get(userCtrl.userUnlikePost);

router.route('/:userId/find-nearest-friends')

  /** POST /api/users/:userId/find-nearest-friends Users near(Geo) friends */
  .post(userCtrl.findNearestFriends);

router.route('/:userId/user-create-post')

  /** POST /api/users/:userId/create-post User create post */
  .post(userCtrl.userCreatePost);

router.route('/:userId/user-delete-post')

  /** DELETE /api/users/:userId/user-delete-post  User delete post */
  .delete(userCtrl.userDeletePost);

router.route('/:userId/user-edit-post')

  /** PUT /api/users/:userId/user-edit-post User editing post */
  .put(userCtrl.userEditPost);

router.route('/:userId/user-create-reply')

  /** POST /api/users/user-create-reply User create reply on post */
  .post(userCtrl.userCreateReply);

router.route('/:userId/user-delete-reply')

  /** DELETE /api/users/user-remove-reply User remove reply on post */
  .delete(userCtrl.userDeleteReply);


router.route('/:userId/user-edit-reply')

  /** PUT /:userId/user-edit-reply User editing reply */
  .put(userCtrl.userEditReply);

router.route('/:userId/find-nearest-friends-coordinates')

  /** POST /api/users/userId find-nearest-friends-coordinates User near(Geo) friends id and coords*/
  .post(userCtrl.findNearestFriendsCoordinates);

router.route('/:userId/get-position')

  .get(userCtrl.getUserPosition);

router.route('/:userId/user-create-group')
  .post(userCtrl.userCreateGroup);

router.route('/:userId/user-remove-group')
  .delete(userCtrl.userRemoveGroup);

router.route('/:userId/create-event')

  /** PUT /api/users/:userId/createEvent User create new event */
  .put(validate(paramValidation.createEvent), userCtrl.createUserEvent);

router.route('/:userId/remove-event')

  /** DELETE /api/users/:userId/createEvent User delete event */
  .delete(userCtrl.removeUserEvent);

router.route('/:userId/join-group/:groupId')

  /** POST /api/users/:userId/join-group/:groupId User following group */
  .post(userCtrl.joinGroup);

router.route('/:userId/unfollow-group/:groupId')
  /** POST /api/users/:userId/unfollow-group/:groupId User unfollowing group */
  .post(userCtrl.unfollowGroup);

router.route('/:userId/find-nearest')

   /** POST /api/users/:userId/find-nearest/:minDistance/:maxDistance find nearest Users */
  .post(userCtrl.findNearest);

router.route('/:userId/find-nearest-coordinates')

  /** POST /api/users/:userId/find-nearest/ find nearest Users coordinates */
 .post(userCtrl.findNearCoordinates);

router.route('/:userId/send-request/:requestedUserId')

  /** POST /api/users/:userId/join-group/:groupId User send request */
  .post(userCtrl.sendRequest);

router.route('/:userId/block-user/:blockUserId')

  /** POST /api/users/:userId/block-user/:blockUserId User blocking  */
  .post(userCtrl.blockUser);

router.route('/:userId/unblock-user/:unblockUserId')

  /** POST /api/users/:userId/unblock-user/:unblockUserId User unblocking */
  .post(userCtrl.unblockUser);

router.route('/:userId/remove-friend/:unfriendUserId')

  /** POST /api/users/:userId/remove-friend/:unfriendUserId User removing from friends */
  .post(userCtrl.removeUserFriend);

router.route('/:userId/follow-event/:eventId')

  /** POST /api/users/:userId/create-event/:eventId User create event */
  .post(userCtrl.followUserEvent);

router.route('/:userId/unfollow-event/:eventId')

  /** POST /api/users/:userId/create-event/:eventId User removing event */
  .post(userCtrl.unfollowUserEvent);

router.route('/:userId/update-position/:lat/:lng')

  /** POST /api/users/:userId/update-position/:lat/:lng Update users position */
  .post(userCtrl.updateUserPosition);

router.route('/:userId/approve-request/:userForApproveId')

  /** POST /api/users/:userId/approve-request/:userForApproveId Approves user friend request */
  .post(userCtrl.approveFriendsRequest);

router.route('/:userId/remove-request/:userRemoveId')

  /** POST /api/users/:userId/approve-request/:userForApproveId Removes from friend requests */
  .post(userCtrl.removeFriendRequest);

router.route('/:userId/user-create-chat-room')

  .post(userCtrl.createChatRoom);

router.route('/:userId/user-join-chat-room/:roomId')
  .get(userCtrl.joinChatRoom);

router.route('/:userId/find-nearest-events')

  /** POST /api/users/:userId/find-nearest-events User find near(Geo) events */
  .post(userCtrl.findNearestEvents);

router.route('/:userId/update-user-status')

  /** POST /api/users/:userId/find-nearest-events User find near(Geo) events */
  .post(userCtrl.updateStatus);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
