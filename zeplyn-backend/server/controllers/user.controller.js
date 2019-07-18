import httpStatus from 'http-status';
import User from '../models/user.model';
import APIError from '../helpers/APIError';
import client from '../redis';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    username: req.body.username,
    phone: req.body.phone,
    email: req.body.email,
    refreshToken: 'xxx',
    authToken: 'xxx',
    socialNetwork: req.body.socialNetwork,
    avatar: req.body.avatar,
    profile: req.body.profile,
    location: req.body.location,
    events: req.body.events,
    followingGroups: req.body.followingGroups,
    locationProvider: req.body.locationProvider,
  });
  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const { user, body } = req;
  const { _id, friends, ...rest } = body; // eslint-disable-line no-unused-vars
  User.findOneAndUpdate(
    { _id: user._id },
    rest,
    { new: true }
  )
  .then(savedUser => res.json(savedUser))
  .catch(e => next(e));
}

function createUserEvent(req, res, next) {
  const { user, body } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userCreateEvent(body);
    }
    const err = new APIError('User not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(creatingResult => res.json(creatingResult))
  .catch(e => next(e));
}

function removeUserEvent(req, res, next) {
  const { user, body } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.removeUserEvent(body.eventId);
    }
    const err = new APIError('User not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(creatingResult => res.json(creatingResult))
  .catch(e => next(e));
}

function joinGroup(req, res, next) {
  const { userId, groupId } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.joinGroup(groupId);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(userInGroup => res.json(userInGroup))
  .catch(e => next(e));
}

function unfollowGroup(req, res, next) {
  const { userId, groupId } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.unfollowGroup(groupId);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(userInGroup => res.json(userInGroup))
  .catch(e => next(e));
}

function sendRequest(req, res, next) {
  const { userId, requestedUserId } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.addFriends(requestedUserId);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function blockUser(req, res, next) {
  const { userId, blockUserId } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.block(blockUserId);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(blocked => res.json(blocked))
  .catch(e => next(e));
}

function unblockUser(req, res, next) {
  const { userId, unblockUserId } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.unblockUser(unblockUserId);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(unblocked => res.json(unblocked))
  .catch(e => next(e));
}

function removeUserFriend(req, res, next) {
  const { userId, unfriendUserId } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.removeUserFriend(unfriendUserId);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(unFriended => res.json(unFriended))
  .catch(e => next(e));
}

function followUserEvent(req, res, next) {
  const { userId, eventId } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.followEvent(eventId);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function unfollowUserEvent(req, res, next) {
  const { userId, eventId } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.unfollowUserEvent(eventId);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function updateUserPosition(req, res, next) {
  const { userId, lat = 0, lng = 0 } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      const coordinates = [parseFloat(lng), parseFloat(lat)];
      return userFinded.updatePosition(userId, coordinates);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function approveFriendsRequest(req, res, next) {
  const { userId, userForApproveId } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.approveFriendRequests(userForApproveId);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function removeFriendRequest(req, res, next) {
  const { userId, userRemoveId } = req.params;
  User.findById(userId)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.removeFriendRequest(userRemoveId);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function findNearest(req, res, next) {
  const { user, body } = req;
  const { minDistance = 1, maxDistance = 100 } = body;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      if (maxDistance <= 200) {
        return userFinded.findNear(minDistance, maxDistance);
      }
      const err = new APIError('Max distance cant be bigger than 200!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function findNearCoordinates(req, res, next) {
  const { user, body } = req;
  const { minDistance = 1, maxDistance = 100 } = body;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      if (maxDistance <= 200) {
        return userFinded.findNearCoordinates(minDistance, maxDistance);
      }
      const err = new APIError('Max distance cant be bigger than 200!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function findNearestFriendsCoordinates(req, res, next) {
  const { user, body: { minDistance = 1, maxDistance = 100 } } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      if (maxDistance <= 10000) {
        return userFinded.findNearestFriendsCoordinates(minDistance, maxDistance);
      }
      const err = new APIError('Max distance cant be bigger than 10000!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function findNearestFriends(req, res, next) {
  const { user, body: { minDistance = 1, maxDistance = 100 } } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      if (maxDistance <= 10000) {
        return userFinded.findNearestFriends(minDistance, maxDistance);
      }
      const err = new APIError('Max distance cant be bigger than 10000!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function getUserPosition(req, res, next) {
  const { user } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return res.json(userFinded.location.geo.coordinates);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function userCreateGroup(req, res, next) {
  const { user, body } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userCreateGroup(body);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function userRemoveGroup(req, res, next) {
  const { user, body } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userRemoveGroup(body.groupId);
    }
    const err = new APIError('User not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(creatingResult => res.json(creatingResult))
  .catch(e => next(e));
}

function userCreatePost(req, res, next) {
  const { user, body } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userCreatePost(body);
    }
    const err = new APIError('User not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(postCreated => res.json(postCreated))
  .catch(e => next(e));
}

function userDeletePost(req, res, next) {
  const { user, body } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userDeletePost(body);
    }
    const err = new APIError('User not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(postDeleted => res.json(postDeleted))
  .catch(e => next(e));
}

function userEditPost(req, res, next) {
  const { user, body } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userEditPost(body);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(postEdited => res.json(postEdited))
  .catch(e => next(e));
}

function userCreateReply(req, res, next) {
  const { user, body: { reply, post } } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userCreateReply(reply, post);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(replyCreated => res.json(replyCreated))
  .catch(e => next(e));
}

function userDeleteReply(req, res, next) {
  const { user, body: { replyId, postId } } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userDeleteReply(postId, replyId);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(replyCreated => res.json(replyCreated))
  .catch(e => next(e));
}

function userPostSearch(req, res, next) {
  const { user, params: { queryString } } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userPostSearch(queryString);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(searchResults => res.json(searchResults))
  .catch(e => next(e));
}

function userGroupSearch(req, res, next) {
  const { user, params: { queryString } } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userGroupSearch(queryString);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(searchResults => res.json(searchResults))
  .catch(e => next(e));
}

function userEventSearch(req, res, next) {
  const { user, params: { queryString } } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userEventSearch(queryString);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(searchResults => res.json(searchResults))
  .catch(e => next(e));
}

function userEditReply(req, res, next) {
  const { user, body } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userEditReply(body);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(replyEdited => res.json(replyEdited))
  .catch(e => next(e));
}

function getUserFriends(req, res, next) {
  const { user } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.getUserFriends(userFinded);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(usersFriends => res.json(usersFriends))
  .catch(e => next(e));
}

function userLikePost(req, res, next) {
  const { user, params } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userLikePost(params.postId);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(postLiked => res.json(postLiked))
  .catch(e => next(e));
}

function userUnlikePost(req, res, next) {
  const { user, params } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.userUnlikePost(params.postId);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(userUnlikedPost => res.json(userUnlikedPost))
  .catch(e => next(e));
}

function findNearestEvents(req, res, next) {
  const { user, body: { minDistance = 1, maxDistance = 100 } } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      if (maxDistance <= 1000) {
        return userFinded.findNearestEvents(minDistance, maxDistance);
      }
      const err = new APIError('Max distance cant be bigger than 10000!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }
    const err = new APIError('User does not exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

function updateStatus(req, res, next) {
  const { user, body: { status } } = req;
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.updateStatus(status);
    }
    const err = new APIError('No such user exists', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(result => res.json(result))
  .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then((users) => {
      res.set('X-Total-Count', users.length);
      res.set('Access-Control-Expose-Headers', 'X-Total-Count');
      res.json(users);
    })
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

function createChatRoom(req, res, next) {
  const { user, body } = req;
  User.findById(user)
  .exec()
  .then((findedUser) => {
    if (findedUser) {
      return findedUser.createRoom(body.userIds);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then(chatRoomCreated => res.json(chatRoomCreated))
  .catch(e => next(e));
}

function joinChatRoom(req, res, next) {
  const { user, params } = req;
  const { roomId } = params;
  let joinedRoom = '';
  User.findById(user)
  .exec()
  .then((userFinded) => {
    if (userFinded) {
      return userFinded.joinChatRoom(roomId);
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  })
  .then((joinedRoomRes) => {
    joinedRoom = `REDIS_JOINED_ROOM_${joinedRoomRes._id}`;
    return client.smembersAsync(joinedRoom);
  })
  .then(() => client.saddAsync(joinedRoom, user._id.toString()))
  .then(() => client.smembersAsync(joinedRoom))
  .then(response => res.json(response))
  .catch(e => next(e));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove,
  joinGroup,
  unfollowGroup,
  blockUser,
  unblockUser,
  removeUserFriend,
  followUserEvent,
  unfollowUserEvent,
  updateUserPosition,
  approveFriendsRequest,
  sendRequest,
  removeFriendRequest,
  findNearest,
  createUserEvent,
  removeUserEvent,
  findNearestFriends,
  getUserPosition,
  findNearCoordinates,
  findNearestFriendsCoordinates,
  userCreateGroup,
  userRemoveGroup,
  userCreatePost,
  userDeletePost,
  userEditPost,
  userCreateReply,
  userDeleteReply,
  userPostSearch,
  userEditReply,
  getUserFriends,
  createChatRoom,
  joinChatRoom,
  userLikePost,
  userUnlikePost,
  userGroupSearch,
  userEventSearch,
  findNearestEvents,
  updateStatus
};
