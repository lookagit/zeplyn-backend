import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import { Experience, Profile } from './user';
import Event from '../models/events.model';
import Group from '../models/group.model';
import Post from '../models/posts.model';
import Room from '../models/rooms.model';
import client from '../redis';
/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    $type: String,
    required: true
  },
  socialNetwork: {
    $type: String,
    required: true
  },
  authToken: {
    $type: String,
    required: true
  },
  refreshToken: {
    $type: String,
    required: true
  },
  email: {
    $type: String,
    required: true,
    match: [/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'The value of path {PATH} ({VALUE}) is not a valid email.']
  },
  experiences: [Experience],
  profile: [Profile],
  phone: {
    $type: String,
// match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  createdAt: {
    $type: Date,
    default: Date.now
  },
  avatar: {
    $type: String,
    default: 'profileImage'
  },
  location: {
    $type: Object,
    geo: {
      type: String,
      coordinates: [Number],
    }
  },
  locationProvider: {
    $type: String
  },
  status: {
    $type: String,
    enum: ['available', 'offline', 'busy'],
    default: 'available'
  },
  followingGroups: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  blockedUsers: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedBy: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  events: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  groupsCreated: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  eventsCreated: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  addedFriendRequest: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  receivedFriendRequest: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { typeKey: '$type' });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.index({ 'location.geo': '2dsphere' });

UserSchema.virtual('id').get(function id() {
  return this._id && this._id.toHexString();
});

UserSchema.virtual('lat').get(function id() {
  return this.location && this.location.geo.coordinates[1];
});

UserSchema.virtual('lon').get(function id() {
  return this.location && this.location.geo.coordinates[0];
});

UserSchema.set('toJSON', {
  virtuals: true
});

UserSchema.method({
  block(userId) {
    return this.model('User').findById(userId)
    .exec()
    .then((blockableUser) => {
      if (blockableUser) {
        return Promise.all([
          this.model('User')
            .findOneAndUpdate(
              { _id: this._id },
              { $push: { blockedUsers: blockableUser._id } },
              { new: true }
            ),
          this.model('User')
            .findOneAndUpdate(
              { _id: blockableUser._id },
              { $push: { blockedBy: this._id } },
              { new: true }
            )
        ]);
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  addFriends(userId) {
    return this.model('User').findById(userId)
    .exec()
    .then((addFriend) => {
      if (addFriend) {
        return Promise.all([
          this.model('User')
            .findOneAndUpdate(
              { _id: this._id },
              { $push: { addedFriendRequest: addFriend._id } },
              { new: true }
            ),
          this.model('User')
            .findOneAndUpdate(
              { _id: addFriend._id },
              { $push: { receivedFriendRequest: this._id } },
              { new: true }
            )
        ]);
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  approveFriendRequests(userId) {
    return this.model('User').findById(userId)
    .exec()
    .then((requestedUser) => {
      if (requestedUser) {
        if (this.receivedFriendRequest.indexOf(requestedUser._id) > -1) {
          return Promise.all([
            this.model('User')
            .findOneAndUpdate(
              { _id: this._id },
              {
                $pull: {
                  receivedFriendRequest: requestedUser._id
                },
                $push: {
                  friends: requestedUser._id
                },
              },
              { new: true }
            ),
            this.model('User')
            .findOneAndUpdate(
              { _id: requestedUser },
              { $pull: { addedFriendRequest: this._id }, $push: { friends: this._id } },
              { new: true }
            )
          ]);
        }
      }
      const err = new APIError('No such user exists', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  removeFriendRequest(userId) {
    return this.model('User').findById(userId)
    .exec()
    .then((userForRemove) => {
      if (userForRemove) {
        return Promise.all([
          this.model('User')
            .findOneAndUpdate(
              { _id: this._id },
              { $pull: { receivedFriendRequest: userForRemove._id } },
              { new: true }
            ),
          this.model('User')
            .findOneAndUpdate(
              { _id: userForRemove._id },
              { $pull: { addedFriendRequest: this._id } },
              { new: true }
            )
        ]);
      }
      const err = new APIError('No such user exists', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  joinGroup(groupId) {
    return this.model('Group').findById(groupId)
    .exec()
    .then((groupForUser) => {
      if (groupForUser) {
        return Promise.all([
          this.model('Group')
            .findOneAndUpdate(
              { _id: groupForUser._id },
              { $addToSet: { participants: this._id } },
              { new: true }
            ),
          this.model('User')
            .findOneAndUpdate(
              { _id: this._id },
              { $addToSet: { followingGroups: groupForUser._id } },
              { new: true }
            )
        ]);
      }
      const err = new APIError('No such group exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  unfollowGroup(groupId) {
    return this.model('Group').findById(groupId)
    .exec()
    .then((groupForUser) => {
      if (groupForUser) {
        return Promise.all([
          this.model('Group')
            .findOneAndUpdate(
              { _id: groupForUser._id },
              { $pull: { participants: this._id } },
              { new: true }
            ),
          this.model('User')
            .findOneAndUpdate(
              { _id: this._id },
              { $pull: { followingGroups: groupForUser._id } },
              { new: true }
            )
        ]);
      }
      const err = new APIError('No such group exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  followEvent(eventId) {
    return this.model('Event').findById(eventId)
    .exec()
    .then((findedEvent) => {
      if (findedEvent) {
        return Promise.all([
          this.model('Event')
          .findOneAndUpdate(
            { _id: findedEvent._id },
            {
              $addToSet: { participants: this._id }
            },
            { new: true }
          ),
          this.model('User')
          .findOneAndUpdate(
            { _id: this._id },
            {
              $addToSet: { events: findedEvent._id }
            },
            { new: true }
          )
        ]);
      }
      const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  unfollowUserEvent(eventId) {
    return this.model('Event').findById(eventId)
    .exec()
    .then((eventForUnfollow) => {
      if (eventForUnfollow) {
        return Promise.all([
          this.model('User')
            .findOneAndUpdate(
              { _id: this._id },
              { $pull: { events: eventForUnfollow._id } },
              { new: true }
            ),
          this.model('Event')
            .findOneAndUpdate(
              { _id: eventForUnfollow._id },
              { $pull: { participants: this._id } },
              { new: true }
            )
        ]);
      }
      const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  removeUserFriend(userId) {
    return this.model('User').findById(userId)
    .exec()
    .then((userForUnfriend) => {
      if (userForUnfriend) {
        return Promise.all([
          this.model('User')
            .findOneAndUpdate(
              { _id: userForUnfriend._id },
              { $pull: { friends: this._id } },
              { new: true }
            ),
          this.model('User')
            .findOneAndUpdate(
              { _id: this._id },
              { $pull: { friends: userForUnfriend._id } },
              { new: true }
            )
        ]);
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  unblockUser(userId) {
    return this.model('User').findById(userId)
    .exec()
    .then((userForUnblock) => {
      if (userForUnblock) {
        return Promise.all([
          this.model('User')
            .findOneAndUpdate(
              { _id: userForUnblock._id },
              { $pull: { blockedBy: this._id } },
              { new: true }
            ),
          this.model('User')
            .findOneAndUpdate(
              { _id: this._id },
              { $pull: { blockedUsers: userForUnblock._id } },
              { new: true }
            )
        ]);
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  updatePosition(userId, coordinates) {
    return this.model('User').findById(userId)
    .exec()
    .then((userLocationUpdate) => {
      if (userLocationUpdate) {
        return this.model('User')
          .findOneAndUpdate(
            { _id: userLocationUpdate._id },
            { $set: { location: { geo: { coordinates, type: 'Point' } } } },
            { new: true }
          );
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  findNear(minDistance, maxDistance) {
    const { coordinates } = this.location.geo;
    return this.model('User').find(
      {
        'location.geo': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $minDistance: minDistance,
            $maxDistance: maxDistance
          },
        },
      }
    );
  },
  userCreateEvent(eventForCreate) {
    const eventCreate = new Event(eventForCreate);
    return eventCreate.save()
    .then((createdEvent) => {
      if (createdEvent) {
        return Promise.all([
          this.model('Event')
          .findOneAndUpdate(
            { _id: createdEvent._id },
            { $set: { createdBy: this._id } },
            { new: true }
          ),
          this.model('User')
          .findOneAndUpdate(
            { _id: this._id },
            { $push: { eventsCreated: createdEvent._id } },
            { new: true }
          )
        ]);
      }
      const err = new APIError('Event not created!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  removeUserEvent(eventId) {
    return this.model('Event').findById(eventId)
    .exec()
    .then((eventFinded) => {
      if (eventFinded) {
        return Promise.all([
          this.model('Event')
          .findOneAndUpdate(
            { _id: eventFinded._id },
            { $set: { isDeleted: true } },
            { new: true }
          ),

          this.model('User').update(
            {},
            {
              $pull: { eventsCreated: eventFinded._id, events: eventFinded._id },
            },
            { multi: true }
          )
        ]);
      }
      const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  findNearestFriends(minDistance, maxDistance) {
    const { coordinates } = this.location.geo;
    return this.model('User').find(
      {
        'location.geo': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $minDistance: minDistance,
            $maxDistance: maxDistance
          },
        },
      }
    ).where('friends').in([this._id]);
  },
  findNearestFriendsCoordinates(minDistance, maxDistance) {
    const { coordinates } = this.location.geo;
    return this.model('User').find(
      {
        'location.geo': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $minDistance: minDistance,
            $maxDistance: maxDistance
          },
        },
      },
      { 'location.geo.coordinates': 1 }
    ).where('friends').in([this._id]);
  },
  findNearCoordinates(minDistance, maxDistance) {
    const { coordinates } = this.location.geo;
    return this.model('User').find(
      {
        'location.geo': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $minDistance: minDistance,
            $maxDistance: maxDistance
          },
        },
      },
      { 'location.geo.coordinates': 1 }
    );
  },
  userCreateGroup(groupForCreate) {
    const groupCreate = new Group(groupForCreate);
    return groupCreate.save()
    .then((createdGroup) => {
      if (createdGroup) {
        return Promise.all([
          this.model('Group')
          .findOneAndUpdate(
            { _id: createdGroup._id },
            { $set: { createdBy: this._id } },
            { new: true }
          ),
          this.model('User')
          .findOneAndUpdate(
            { _id: this._id },
            { $push: { groupsCreated: createdGroup._id } },
            { new: true }
          )
        ]);
      }
      const err = new APIError('Group not created!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  userRemoveGroup(groupId) {
    return this.model('Group').findById(groupId)
    .exec()
    .then((groupFinded) => {
      if (groupFinded) {
        return Promise.all([
          this.model('Group')
          .findOneAndUpdate(
            { _id: groupFinded._id },
            { $set: { isDeleted: true } },
            { new: true }
          ),
          this.model('User').update(
            {},
            {
              $pull: { groupsCreated: groupFinded._id, followingGroups: groupFinded._id },
            },
            { multi: true }
          )
        ]);
      }
      const err = new APIError('No such group exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  userCreatePost(post) {
    const postCreate = new Post({ ...post, authorId: this._id, authorUsername: this.username });
    return postCreate.save()
    .then((createdPost) => {
      if (createdPost) {
        return this.model('Post').get(createdPost._id);
      }
      const err = new APIError('Post not created!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  userDeletePost(post) {
    return this.model('Post').findById(post.postId)
    .exec()
    .then((findedPost) => {
      if (findedPost) {
        const ids = [...findedPost, findedPost._id];
        return this.model('Post').update(
          { _id: { $in: ids } },
          { $set: { isDeleted: true } }
        );
      }
      const err = new APIError('No such post exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  userEditPost(post) {
    return this.model('Post').findById(post)
    .exec()
    .then((findedPost) => {
      if (findedPost) {
        return this.model('Post')
        .findOneAndUpdate(
          { _id: post._id },
          post,
          { new: true }
        );
      }
      const err = new APIError('No such post exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  userCreateReply(reply, post) {
    const replyCreate = new Post({ ...reply, authorId: this._id, authorUsername: this.username });
    return replyCreate.save()
    .then((replyCreated) => {
      if (replyCreated) {
        return Promise.all([
          this.model('Post')
          .findOneAndUpdate(
            { _id: post },
            {
              $addToSet: { replies: replyCreated._id }
            },
            { new: true }
          ),
          replyCreated
        ]);
      }
      const err = new APIError('Post reply not created!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  userDeleteReply(postId, replyId) {
    return this.model('Post').findById(postId)
    .exec()
    .then((findedPost) => {
      if (findedPost) {
        return Promise.all([
          this.model('Post')
          .findOneAndUpdate(
            { _id: postId },
            { $pull: { replies: replyId } },
            { new: true }
          ),
          this.model('Post')
          .findOneAndUpdate(
            { _id: replyId },
            { $set: { isDeleted: true } },
            { new: true }
          )
        ]);
      }
      const err = new APIError('No such post exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  userEditReply(reply) {
    return this.model('Post').findById(reply)
    .exec()
    .then((findedPost) => {
      if (findedPost) {
        return this.model('Post')
        .findOneAndUpdate(
          { _id: findedPost._id },
          reply,
          { new: true }
        );
      }
      const err = new APIError('No such post exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  userPostSearch(queryString) {
    return this.model('Post').textSearchPost(queryString);
  },
  getUserFriends() {
    return this.model('User').find({ _id: { $in: this.friends } });
  },
  createRoom(userIds) {
    const room = new Room({ users: userIds });
    return room.save()
    .then((savedRoom) => {
      if (savedRoom) {
        const roomIdRedis = `REDIS_ROOM_${savedRoom._id}`;
        return Promise.all([
          this.model('Room').findById(savedRoom)
          .exec(),
          client.setAsync(roomIdRedis, this._id.toString())
        ]);
      }
      const err = new APIError('No such room exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  userGroupSearch(queryString) {
    return this.model('Group').textSearchGroup(queryString);
  },
  userEventSearch(queryString) {
    return this.model('Event').textSearchEvent(queryString);
  },
  userLikePost(postId) {
    return this.model('Post').findById(postId)
    .exec()
    .then((findedPost) => {
      if (findedPost) {
        return this.model('Post')
        .findOneAndUpdate(
          { _id: findedPost._id },
          {
            $addToSet: { likesArr: this._id },
            $inc: { likes: 1 }
          },
          { new: true }
        )
        .then(postUpdated => this.model('Post').get(postUpdated._id));
      }
      const err = new APIError('No such post exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  userUnlikePost(postId) {
    return this.model('Post').findById(postId)
    .exec()
    .then((findedPost) => {
      if (findedPost) {
        return this.model('Post')
        .findOneAndUpdate(
          { _id: findedPost._id },
          {
            $pull: { likesArr: this._id },
            $inc: { likes: -1 }
          },
          { new: true }
        )
        .then(postUpdated => this.model('Post').get(postUpdated._id));
      }
      const err = new APIError('No such post exists or user wasnt like this post!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  findNearestEvents(minDistance, maxDistance) {
    const { coordinates } = this.location.geo;
    return this.model('Event').find(
      {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $minDistance: minDistance,
            $maxDistance: maxDistance
          },
        },
      }
    );
  },
  updateStatus(status) {
    return this.model('User')
    .findOneAndUpdate(
      { _id: this._id },
      { $set: { status } },
      { new: true }
    );
  }
});
/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  findOrCreate: require("find-or-create") //eslint-disable-line

};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
