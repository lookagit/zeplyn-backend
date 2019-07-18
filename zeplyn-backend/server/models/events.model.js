import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const EventSchema = new mongoose.Schema({
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
  subtitle: {
    $type: String,
  },
  price: {
    $type: Number,
    default: 0,
  },
  image: {
    $type: String,
  },
  category: {
    $type: String
  },
  website: {
    $type: String
  },
  openingHours: {
    open: {
      $type: Number,
      default: 0,
      min: 0,
      max: 1440
    },
    close: {
      $type: Number,
      default: 1440,  // if we store time in minutes we can use lt and gt
      min: 0,
      max: 1440
    }
  },
  address: {
    $type: String,
    required: true,
  },
  location: {
    type: String,
    coordinates: [Number]
  },
  date: {
    start: {
      $type: Date,
      required: true
    },
    finished: {
      $type: Date,
      required: true
    }
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

EventSchema.pre('find', softDeleteMiddleware);
EventSchema.pre('findOne', softDeleteMiddleware);

function softDeleteMiddleware(next) {
  // If `isDeleted` is not set on the query, set it to `false` so we only
  // get docs that haven't been deleted by default
  const filter = this.getQuery();
  if (filter.isDeleted == null) {
    filter.isDeleted = false;
  }
  next();
}

EventSchema.index({ location: '2dsphere' });
EventSchema.index(
  { name: 'text', description: 'text', subtitle: 'text', address: 'text' },
  {
    weights: {
      title: 5,
      subtitle: 4,
      address: 4,
      description: 1
    }
  }
);

/**
 * Methods
 */

EventSchema.virtual('id').get(function id() {
  return this._id && this._id.toHexString();
});

EventSchema.set('toJSON', {
  virtuals: true
});

EventSchema.method({
});

/**
 * Statics
 */
EventSchema.statics = {
  /**
   * Get event
   * @param {ObjectId} id - The objectId of event.
   * @returns {Promise<Event, APIError>}
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
   * List events in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of events to be skipped.
   * @param {number} limit - Limit number of events to be returned.
   * @returns {Promise<Event[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * List users finded by query.
   * @param {string} queryString - String to be searched by.
   * @returns {Promise<Event[]>}
   */
  textSearchEvent(queryString) {
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
 * @typedef Event
 */
export default mongoose.model('Event', EventSchema);
