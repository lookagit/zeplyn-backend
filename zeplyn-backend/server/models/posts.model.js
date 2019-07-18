import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Post Schema
 */
const PostSchema = new mongoose.Schema({
  authorId: {
    $type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  authorUsername: {
    $type: String,
    required: true,
  },
  groupName: {
    $type: String,
    default: null,
  },
  text: {
    $type: String,
    required: true
  },
  address: {
    $type: String,
  },
  image: {
    $type: String
  },
  likes: {
    $type: Number,
    default: 0
  },
  createdAt: {
    $type: Date,
    default: Date.now
  },
  postedAs: {
    $type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  isDeleted: {
    $type: Boolean,
    default: false,
  },
  replies: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  likesArr: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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

PostSchema.virtual('id').get(function id() {
  return this._id && this._id.toHexString();
});

PostSchema.index({ text: 'text', authorUsername: 'text', groupName: 'text' });

PostSchema.set('toJSON', {
  virtuals: true
});

PostSchema.pre('find', softDeleteMiddleware);
PostSchema.pre('findOne', softDeleteMiddleware);

function softDeleteMiddleware(next) {
  // If `isDeleted` is not set on the query, set it to `false` so we only
  // get docs that haven't been deleted by default
  const filter = this.getQuery();
  if (filter.isDeleted == null) {
    filter.isDeleted = false;
  }
  next();
}

PostSchema.method({

});

/**
 * Statics
 */
PostSchema.statics = {
  /**
   * text search post
   * @param {QueryString} queryString
   * @returns {Promise<Post[]>}
   */
  textSearchPost(queryString) {
    return this.find(
      {
        $text: {
          $search: queryString
        }
      }
    )
    .populate({
      path: 'authorId',
      select: '_id avatar',
    })
    .populate({
      path: 'replies',
      populate: {
        path: 'authorId',
        select: '_id username avatar'
      }
    })
    .populate({
      path: 'postedAs',
      select: 'name'
    })
    .exec();
  },
  /**
   * Get post
   * @param {ObjectId} id - The objectId of post.
   * @returns {Promise<Post, APIError>}
   */
  get(id) {
    const idToSearch = mongoose.Types.ObjectId(id); // eslint-disable-line new-cap
    return this.findOne({ _id: idToSearch })
    .populate('authorId', { _id: 1, username: 1, avatar: 1 })
    .populate({
      path: 'replies',
      populate: {
        path: 'authorId',
        select: '_id username avatar authorId'
      }
    })
    .populate('postedAs', { _id: 1, name: 1 })
    .then((post) => {
      if (post) {
        return post;
      }
      const err = new APIError('No such post exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  /**
   * List posts in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .populate('authorId', { _id: 1, username: 1, avatar: 1 })
      .populate({
        path: 'replies',
        populate: {
          path: 'authorId',
          select: '_id username avatar authorId'
        }
      })
      .populate('postedAs', { _id: 1, name: 1 })
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  findOrCreate: require("find-or-create") //eslint-disable-line

};

/**
 * @typedef Post
 */
export default mongoose.model('Post', PostSchema);
