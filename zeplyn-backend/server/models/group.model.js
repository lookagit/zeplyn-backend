import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const GroupSchema = new mongoose.Schema({
  name: {
    $type: String,
    required: true
  },
  description: {
    $type: String,
    required: true
  },
  createdAt: {
    $type: Date,
    default: Date.now
  },
  avatar: {
    $type: String
  },
  isDeleted: {
    $type: Boolean,
    default: false,
  },
  createdBy: {
    $type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  participants: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { typeKey: '$type' });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

GroupSchema.pre('find', softDeleteMiddleware);
GroupSchema.pre('findOne', softDeleteMiddleware);

function softDeleteMiddleware(next) {
  // If `isDeleted` is not set on the query, set it to `false` so we only
  // get docs that haven't been deleted by default
  const filter = this.getQuery();
  if (filter.isDeleted == null) {
    filter.isDeleted = false;
  }
  next();
}

/**
 * Methods
 */

GroupSchema.virtual('id').get(function id() {
  return this._id && this._id.toHexString();
});

GroupSchema.set('toJSON', {
  virtuals: true
});

GroupSchema.index(
  { name: 'text', description: 'text' },
  {
    weights: {
      name: 5,
      description: 1
    }
  }
);

GroupSchema.method({
});

/**
 * Statics
 */
GroupSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of group.
   * @returns {Promise<Group, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((group) => {
        if (group) {
          return group;
        }
        const err = new APIError('No such group exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Group[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  textSearchGroup(queryString) {
    return this.find(
      {
        $text: {
          $search: queryString
        }
      }
    )
    .exec();
  },

  findOrCreate: require("find-or-create") //eslint-disable-line

};

/**
 * @typedef Group
 */
export default mongoose.model('Group', GroupSchema);
