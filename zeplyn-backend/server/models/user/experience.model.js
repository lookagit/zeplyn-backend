import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';

/**
 * User Schema
 */
const ExperienceSchema = new mongoose.Schema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  job: {
    type: String,
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

ExperienceSchema.virtual('id').get(function id() {
  return this._id && this._id.toHexString();
});

ExperienceSchema.set('toJSON', {
  virtuals: true
});

ExperienceSchema.method({
});

/**
 * Statics
 */
ExperienceSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Experience, APIError>}
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
   * @returns {Promise<Experience[]>}
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

export default ExperienceSchema;
