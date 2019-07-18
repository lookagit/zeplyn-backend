import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Message Schema
 */
const MessageSchema = new mongoose.Schema({
  ownerId: {
    $type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    $type: String,
    required: true,
  },
  createdAt: {
    $type: Date,
    default: Date.now
  },
  roomId: {
    $type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
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

MessageSchema.virtual('id').get(function id() {
  return this._id && this._id.toHexString();
});

MessageSchema.set('toJSON', {
  virtuals: true
});


MessageSchema.method({

});

/**
 * Statics
 */
MessageSchema.statics = {
  /**
   * Get message
   * @param {ObjectId} id - The objectId of message.
   * @returns {Promise<Message, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((message) => {
        if (message) {
          return message;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * List message in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of messages to be skipped.
   * @param {number} limit - Limit number of messages to be returned.
   * @returns {Promise<Message[]>}
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
 * @typedef Message
 */
export default mongoose.model('Message', MessageSchema);
