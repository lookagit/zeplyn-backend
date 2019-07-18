import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Room Schema
 */
const RoomSchema = new mongoose.Schema({
  users: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
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

RoomSchema.virtual('id').get(function id() {
  return this._id && this._id.toHexString();
});

RoomSchema.set('toJSON', {
  virtuals: true
});

RoomSchema.method({
});

/**
 * Statics
 */
RoomSchema.statics = {
  /**
   * Get room
   * @param {ObjectId} id - The objectId of room.
   * @returns {Promise<Room, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((room) => {
        if (room) {
          return room;
        }
        const err = new APIError('No such room exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List rooms in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of rooms to be skipped.
   * @param {number} limit - Limit number of rooms to be returned.
   * @returns {Promise<Room[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  getMessages(roomId) {
    return this.model('Message').find({ roomId });
  },
  getRooms(userId) {
    return this.find({ users: { $in: userId } });
  },
  joinChatRoom(userId, roomId) {
    return this.findById(roomId)
    .exec()
    .then((roomFinded) => {
      if (roomFinded) {
        return this.model('Room').findOneAndUpdate(
          { _id: roomFinded._id },
          { $addToSet: { users: userId } },
          { new: true }
        );
      }
      const err = new APIError('No such room exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  findOrCreate: require("find-or-create") //eslint-disable-line

};

/**
 * @typedef Room
 */
export default mongoose.model('Room', RoomSchema);
