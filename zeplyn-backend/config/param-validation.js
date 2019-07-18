import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      phone: Joi.string() // .regex(/^[1-9][0-9]{9}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      avatar: Joi.string(),
      email: Joi.string(),
      experiences: Joi.array(),
      location: Joi.object(),
      phone: Joi.string().regex(/^[1-9][0-9]{9}$/),
      profile: Joi.array(),
      socialNetwork: Joi.string(),
      status: Joi.string(),
      username: Joi.string()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // POST /api/events
  createEvent: {
    body: {
      name: Joi.string().required(),
    }
  },

  // POST /api/posts/postId
  createPost: {
    body: {
      authorId: Joi.string().hex().required(),
      text: Joi.string().required(),
      image: Joi.string()
    }
  },

  // UPDATE /api/posts/postId
  updatePost: {
    body: {
      authorId: Joi.string().hex().required(),
    },
    params: {
      postId: Joi.string().hex().required()
    },
  },

  // UPDATE /api/events/eventId
  updateEvent: {
    body: {
      name: Joi.string().required(),
    },
    params: {
      eventId: Joi.string().hex().required(),
    }
  },

  // POST /api/groups
  createGroup: {
    body: {
      name: Joi.string().required(),
    }
  },

  // UPDATE /api/groups/groupId
  updateGroup: {
    body: {
      name: Joi.string().required(),
    },
    params: {
      groupId: Joi.string().hex().required(),
    }
  },
};
