import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  if (mongoose.connection.db) mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
  done();
});

describe('## User', () => {
  let user = {
    username: 'Darby Stracke',
    email: 'Maryse20@gmail.com',
    authToken: 'xxx',
    refreshToken: 'xxx',
    socialNetwork: 'faker',
    phone: '1234567891',
    locationProvider: 'faker',
    receivedFriendRequest: [],
    addedFriendRequest: [],
    events: [],
    friends: [],
    blockedBy: [],
    blockedUsers: [],
    followingGroups: [],
    location: {
      geo: {
        type: 'Point',
        coordinates: [
          44.793353,
          20.536071
        ]
      }
    },
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/slowspock/128.jpg',
    profile: [
      {
        job: 'Central Markets Strategist',
        website: 'www.faker.com',
      }
    ],
    experiences: [],
  };
  const group = {
    name: 'New group',
    description: 'Very nice',
    category: 'groups cat',
    avatar: 'https://avatar.com',
    participants: [],
  };
  const event = {
    name: 'new event',
    description: 'very nice',
    category: 'events cat',
    website: 'www.com.com',
    address: 'Andre Nikolica 3',
    openingHours: {
      open: 0,
      close: 14,
    },
    location: {
      type: 'Point',
      coordinates: [
        44.793353,
        20.536071
      ],
    },
    date: {
      start: new Date(),
      finished: new Date(),
    },
  };
  const userEvent = {
    name: 'new event',
    description: 'very nice',
    category: 'events cat',
    website: 'www.com.com',
    address: 'Andre Perica 2a',
    openingHours: {
      open: 0,
      close: 14,
    },
    location: {
      type: 'Point',
      coordinates: [
        44.793353,
        20.536071
      ],
    },
    date: {
      start: new Date(),
      finished: new Date(),
    },
  };
  const post = {
    text: 'Nice post',
    address: 'Trg nikole zivica 2',
    image: 'https://placeholder.com/vidimsveze',
  };

  it('should user create and search post', (done) => {
    request(app)
    .post('/api/users')
    .send(user)
    .then((createdUser) => {
      const created = createdUser.body;
      return Promise.all([
        request(app)
        .post(`/api/users/${created._id}/user-create-post/`)
        .send(post),
        createdUser
      ]);
    })
    .then((createResult) => {
      const [createdPost, userCreator] = createResult;
      const { body } = createdPost;
      expect(body.text).to.equal(post.text);
      expect(body.address).to.equal(post.address);
      expect(body.image).to.equal(post.image);
      expect(body.authorId.avatar).to.equal(user.avatar);
      expect(body.authorId.username).to.equal(user.username);
      return request(app)
      .get(`/api/users/${userCreator.body._id}/user-search-posts/Nice`);
    })
    .then((searchResult) => {
      expect(searchResult.body.length).to.be.least(1);
      done();
    })
    .catch(done);
  });

  it('should user change status', (done) => {
    request(app)
    .post('/api/users')
    .send(user)
    .then((createdUser) => {
      const created = createdUser.body;
      expect(created.status).to.be.equal('available');
      return request(app)
      .post(`/api/users/${created._id}/update-user-status/`)
      .send({
        status: 'offline'
      });
    })
    .then((statusUpdate) => {
      expect(statusUpdate.body.status).to.be.equal('offline');
      done();
    })
    .catch(done);
  });

  it('should user create, search, like and unlike post', (done) => {
    request(app)
    .post('/api/users')
    .send(user)
    .then((createdUser) => {
      const created = createdUser.body;
      return Promise.all([
        request(app)
        .post(`/api/users/${created._id}/user-create-post/`)
        .send(post),
        createdUser
      ]);
    })
    .then((createResult) => {
      const [createdPost, userCreator] = createResult;
      const { body } = createdPost;
      return Promise.all([
        request(app)
          .get(`/api/users/${userCreator.body._id}/user-like-post/${body._id}`),
        userCreator.body
      ]);
    })
    .then((likedPostAndUser) => {
      const [likedPost, userCreator] = likedPostAndUser;
      const { body } = likedPost;
      expect(body.likesArr.length).to.be.above(0);
      expect(body.likes).to.be.above(0);
      return request(app)
      .get(`/api/users/${userCreator._id}/user-unlike-post/${body._id}`);
    })
    .then((unlikedPost) => {
      const { body } = unlikedPost;
      expect(body.likesArr.length).to.be.equal(0);
      expect(body.likes).to.be.equal(0);
      done();
    })
    .catch(done);
  });

  it('should user create reply', (done) => {
    request(app)
    .post('/api/users')
    .send(user)
    .then((createdUser) => {
      const created = createdUser.body;
      return Promise.all([
        request(app)
        .post(`/api/users/${created._id}/user-create-post/`)
        .send(post),
        created
      ]);
    })
    .then((creationResult) => {
      const [createdPost, userCreator] = creationResult;
      return request(app)
      .post(`/api/users/${userCreator._id}/user-create-reply`)
      .send({ reply: post, post: createdPost.body._id });
    })
    .then((replyCreation) => {
      const [postReplied, createdReply] = replyCreation.body;
      expect(postReplied.replies).to.include(createdReply._id);
      done();
    })
    .catch(done);
  });

  it('should user edit reply', (done) => {
    request(app)
    .post('/api/users')
    .send(user)
    .then((createdUser) => {
      const created = createdUser.body;
      return Promise.all([
        request(app)
        .post(`/api/users/${created._id}/user-create-post/`)
        .send(post),
        created
      ]);
    })
    .then((creationResult) => {
      const [createdPost, userCreator] = creationResult;
      return Promise.all([
        request(app)
        .post(`/api/users/${userCreator._id}/user-create-reply`)
        .send({ reply: post, post: createdPost.body._id }),
        userCreator
      ]);
    })
    .then((replyCreation) => {
      const [postsFromCreation, userCreator] = replyCreation;
      const [, createdReply] = postsFromCreation.body;
      createdReply.text = 'whole new text';
      return request(app)
      .put(`/api/users/${userCreator._id}/user-edit-reply`)
      .send(createdReply);
    })
    .then((editedReply) => {
      expect(editedReply.body.text).to.equal('whole new text');
      done();
    })
    .catch(done);
  });

  it('should user edit post', (done) => {
    request(app)
    .post('/api/users')
    .send(user)
    .then((createdUser) => {
      user = createdUser.body;
      return request(app)
      .post(`/api/users/${user._id}/user-create-post/`)
      .send(post);
    })
    .then((createdPost) => {
      const newPost = createdPost.body;
      newPost.text = 'novi text';
      return request(app)
      .put(`/api/users/${user._id}/user-edit-post/`)
      .send(newPost);
    })
    .then((editedPost) => {
      expect(editedPost.body.text).to.equal('novi text');
      done();
    })
    .catch(done);
  });

  it('should user remove post', (done) => {
    request(app)
    .post('/api/users')
    .send(user)
    .then((createdUser) => {
      const created = createdUser.body;
      user = created;
      return request(app)
      .post(`/api/users/${created._id}/user-create-post/`)
      .send(post);
    })
    .then((createdPost) => {
      const { body } = createdPost;
      return request(app)
      .delete(`/api/users/${user._id}/user-delete-post/`)
      .send({ postId: body._id });
    })
    .then((removedPost) => {
      const { nModified } = removedPost.body;
      expect(nModified).to.be.above(0);
      done();
    })
    .catch(done);
  });

  it('should user follow event', (done) => {
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/events/')
      .send(event),
      requestApp.post('/api/users/')
      .send(user)
    ])
    .then((results) => {
      const [firstEvent, firstUser] = results;
      const eventToCreate = firstEvent.body;
      const userToJoin = firstUser.body;
      return requestApp.post(`/api/users/${userToJoin._id}/follow-event/${eventToCreate._id}`);
    })
    .then((isJoined) => {
      const [eventWithUser, userWithEvent] = isJoined.body;
      expect(eventWithUser.participants).to.include(userWithEvent._id);
      expect(userWithEvent.events).to.include(eventWithUser._id);
      done();
    })
    .catch(done);
  });

  it('should user unfollow event', (done) => {
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/events/')
      .send(event),
      requestApp.post('/api/users/')
      .send(user)
    ])
    .then((results) => {
      const [firstEvent, firstUser] = results;
      const eventToCreate = firstEvent.body;
      const userToJoin = firstUser.body;
      return requestApp.post(`/api/users/${userToJoin._id}/follow-event/${eventToCreate._id}`);
    })
    .then((isJoined) => {
      const [eventWithUser, userWithEvent] = isJoined.body;
      return requestApp.post(`/api/users/${userWithEvent._id}/unfollow-event/${eventWithUser._id}`);
    })
    .then((isRemoved) => {
      const [userRemoveEvent, eventWithoutUser] = isRemoved.body;
      expect(userRemoveEvent.events).to.not.include(eventWithoutUser._id);
      expect(eventWithoutUser.participants).to.not.include(userRemoveEvent._id);
      done();
    })
    .catch(done);
  });

  it('should user join group', (done) => {
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/groups/')
      .send(group),
      requestApp.post('/api/users/')
      .send(user)
    ])
    .then((results) => {
      const [firstGroup, firstUser] = results;
      const groupToJoin = firstGroup.body;
      const userToJoin = firstUser.body;
      return requestApp.post(`/api/users/${userToJoin._id}/join-group/${groupToJoin._id}`);
    })
    .then((isJoined) => {
      const [groupJoined, userJoined] = isJoined.body;
      expect(groupJoined.participants).to.include(userJoined._id);
      expect(userJoined.followingGroups).to.include(groupJoined._id);
      done();
    })
    .catch(done);
  });

  it('should user unfollow group', (done) => {
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/groups/')
      .send(group),
      requestApp.post('/api/users/')
      .send(user)
    ])
    .then((results) => {
      const [firstGroup, firstUser] = results;
      const groupToJoin = firstGroup.body;
      const userToJoin = firstUser.body;
      return requestApp.post(`/api/users/${userToJoin._id}/join-group/${groupToJoin._id}`);
    })
    .then((isJoined) => {
      const [groupJoined, userJoined] = isJoined.body;
      return requestApp.post(`/api/users/${userJoined._id}/unfollow-group/${groupJoined._id}`);
    })
    .then((isUnfollowed) => {
      const [groupUnfollowed, userUnfollow] = isUnfollowed.body;
      expect(groupUnfollowed.participants).to.not.include(userUnfollow._id);
      expect(userUnfollow.followingGroups).to.not.include(groupUnfollowed._id);
      done();
    })
    .catch(done);
  });

  it('should create a new user', (done) => {
    request(app)
      .post('/api/users/')
      .send(user)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.username).to.equal(user.username);
        expect(res.body.email).to.equal(user.email);
        expect(res.body.authToken).to.equal(user.authToken);
        expect(res.body.refreshToken).to.equal(user.refreshToken);
        expect(res.body.avatar).to.equal(user.avatar);
        expect(res.body.location).to.deep.equal(user.location);
        expect(res.body.locationProvider).to.equal(user.locationProvider);
        expect(res.body.avatar).to.equal(user.avatar);
        user = res.body;
        done();
      })
      .catch(done);
  });

  it('should update user', (done) => {
    const requestApp = request(app);
    requestApp
    .post('/api/users')
    .send(user)
    .then((userCreated) => {
      user.username = 'Lloyd Banks';
      user.phone = '1234567892';
      return requestApp
      .put(`/api/users/${userCreated.body._id}`)
      .send(user);
    })
    .then((userUpdated) => {
      expect(userUpdated.body.username).to.equal(user.username);
      done();
    })
    .catch(done);
  });

  it('should user create and search event', (done) => {
    const requestApp = request(app);
    requestApp
    .post('/api/users')
    .send(user)
    .then(userCreated => requestApp
      .put(`/api/users/${userCreated.body._id}/create-event/`)
      .send(userEvent)
    )
    .then((response) => {
      const [eventCreated, userCreator] = response.body;
      expect(eventCreated.createdBy).to.equal(userCreator._id);
      expect(userCreator.eventsCreated).to.includes(eventCreated._id);
      return request(app)
      .get(`/api/users/${userCreator._id}/user-search-events/new`);
    })
    .then((eventsFinded) => {
      const { body } = eventsFinded;
      expect(body.length).to.be.above(0);
      done();
    })
    .catch(done);
  });

  it('should user create group', (done) => {
    const requestApp = request(app);
    requestApp
    .post('/api/users')
    .send(user)
    .then(userCreated => requestApp
      .post(`/api/users/${userCreated.body._id}/user-create-group`)
      .send(group)
    )
    .then((response) => {
      const [groupCreated, userCreator] = response.body;
      expect(groupCreated.createdBy).to.equal(userCreator._id);
      expect(userCreator.groupsCreated).to.includes(groupCreated._id);
      done();
    })
    .catch(done);
  });

  it('should user remove group', (done) => {
    const requestApp = request(app);
    requestApp
    .post('/api/users')
    .send(user)
    .then(userCreated => requestApp
      .post(`/api/users/${userCreated.body._id}/user-create-group`)
      .send(group)
    )
    .then((response) => {
      const [groupCreated, userCreator] = response.body;
      return requestApp
      .delete(`/api/users/${userCreator._id}/user-remove-group/`)
      .send({ groupId: groupCreated._id });
    })
    .then((groupDeleted) => {
      const [groupDeletedResult, groupUpdateUser] = groupDeleted.body;
      expect(groupDeletedResult.isDeleted).to.equal(true);
      expect(groupUpdateUser.nModified).to.equal(1);
      done();
    })
    .catch(done);
  });

  it('should user remove event', (done) => {
    const requestApp = request(app);
    requestApp
    .post('/api/users')
    .send(user)
    .then(userCreated => requestApp
      .put(`/api/users/${userCreated.body._id}/create-event/`)
      .send(userEvent)
    )
    .then((response) => {
      const [eventCreated, userCreator] = response.body;
      return requestApp
      .delete(`/api/users/${userCreator._id}/remove-event/`)
      .send({ eventId: eventCreated._id });
    })
    .then((eventDeleted) => {
      const [eventDeletedResult, eventUpdateUser] = eventDeleted.body;
      expect(eventUpdateUser.nModified).to.equal(1);
      expect(eventDeletedResult.isDeleted).to.equal(true);
      done();
    })
    .catch(done);
  });

  it('should send request', (done) => {
    let userOne;
    let userTwo;
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/users/')
      .send(user),
      requestApp.post('/api/users/')
      .send(user),
    ])
    .then((responses) => {
      const [firstRes, secondRes] = responses;
      userOne = firstRes.body;
      userTwo = secondRes.body;
      return requestApp
      .post(`/api/users/${userOne._id}/send-request/${userTwo._id}`);
    })
    .then((result) => {
      const [userSent, userReceived] = result.body;
      expect(userSent.addedFriendRequest).to.include(userTwo._id);
      expect(userReceived.receivedFriendRequest).to.include(userOne._id);
      done();
    })
    .catch(done);
  });

  it('should approve request and find friend', (done) => {
    let userOne;
    let userTwo;
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/users/')
      .send(user),
      requestApp.post('/api/users/')
      .send(user),
    ])
    .then((responses) => {
      const [firstRes, secondRes] = responses;
      userOne = firstRes.body;
      userTwo = secondRes.body;
      return requestApp
      .post(`/api/users/${userOne._id}/send-request/${userTwo._id}`);
    })
    .then(() => requestApp.post(`/api/users/${userTwo._id}/approve-request/${userOne._id}`))
    .then((result) => {
      const [userApprove, userApproved] = result.body;
      expect(userApprove.friends).to.include(userApproved._id);
      expect(userApproved.friends).to.include(userApprove._id);
      return userApprove;
    })
    .then(userSearchFriends => Promise.all([
      request(app)
        .get(`/api/users/${userSearchFriends._id}/find-friends`),
      userSearchFriends
    ]))
    .then((findedFriends) => {
      const [findedFriendsArr, userSearched] = findedFriends;
      const { body } = findedFriendsArr;
      const [userFromSearch] = body;
      expect(body.length).to.above(0);
      expect(userFromSearch.friends).to.include(userSearched._id);
      done();
    })
    .catch(done);
  });

  it('should remove request', (done) => {
    let userOne;
    let userTwo;
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/users/')
      .send(user),
      requestApp.post('/api/users/')
      .send(user),
    ])
    .then((responses) => {
      const [firstRes, secondRes] = responses;
      userOne = firstRes.body;
      userTwo = secondRes.body;
      return requestApp
      .post(`/api/users/${userOne._id}/send-request/${userTwo._id}`);
    })
    .then(() => requestApp.post(`/api/users/${userTwo._id}/remove-request/${userOne._id}`))
    .then((result) => {
      const [userRemove, userRemoved] = result.body;
      expect(userRemove.receivedFriendRequest).to.not.include(userRemoved._id);
      expect(userRemoved.addedFriendRequest).to.not.include(userRemove._id);
      done();
    })
    .catch(done);
  });

  it('should block user', (done) => {
    let userOne;
    let userTwo;
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/users/')
      .send(user),
      requestApp.post('/api/users/')
      .send(user),
    ])
    .then((responses) => {
      const [firstRes, secondRes] = responses;
      userOne = firstRes.body;
      userTwo = secondRes.body;
      return requestApp
      .post(`/api/users/${userOne._id}/block-user/${userTwo._id}`);
    })
    .then((result) => {
      const [userBlock, userBlocked] = result.body;
      expect(userBlock.blockedUsers).to.include(userTwo._id);
      expect(userBlocked.blockedBy).to.include(userOne._id);
      done();
    })
    .catch(done);
  });

  it('should unblock user', (done) => {
    let userOne;
    let userTwo;
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/users/')
      .send(user),
      requestApp.post('/api/users/')
      .send(user),
    ])
    .then((responses) => {
      const [firstRes, secondRes] = responses;
      userOne = firstRes.body;
      userTwo = secondRes.body;
      return requestApp
      .post(`/api/users/${userOne._id}/block-user/${userTwo._id}`);
    })
    .then(() => requestApp.post(`/api/users/${userOne._id}/unblock-user/${userTwo._id}`))
    .then((unblockRes) => {
      const [userUnblock, userUnblocked] = unblockRes.body;
      expect(userUnblock.blockedUsers).to.not.include(userTwo._id);
      expect(userUnblocked.blockedBy).to.not.include(userOne._id);
      done();
    })
    .catch(done);
  });

  it('should update users position', (done) => {
    const requestApp = request(app);
    requestApp
    .post('/api/users/')
    .send(user)
    .then((response) => {
      const userId = response.body._id;
      return requestApp.post(`/api/users/${userId}/update-position/10/33`);
    })
    .then((locUpdated) => {
      expect(locUpdated.body.location).to.not.deep.equal(user.location);
      done();
    })
    .catch(done);
  });

  it('should find nearest friends', (done) => {
    let userOne;
    let userTwo;
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/users/')
      .send(user),
      requestApp.post('/api/users/')
      .send(user),
    ])
    .then((responses) => {
      const [firstRes, secondRes] = responses;
      userOne = firstRes.body;
      userTwo = secondRes.body;
      return requestApp
      .post(`/api/users/${userOne._id}/send-request/${userTwo._id}`);
    })
    .then(() => requestApp.post(`/api/users/${userTwo._id}/approve-request/${userOne._id}`))
    .then((result) => {
      const [userApprove] = result.body;
      user._id = userApprove._id;
      return Promise.all([
        requestApp
        .post(`/api/users/${userApprove._id}/find-nearest-friends`)
        .send({
          minDistance: 0,
          maxDistance: 1000,
        }),
        requestApp
        .post(`/api/users/${userApprove._id}/find-nearest-friends`)
        .send({
          minDistance: 0,
          maxDistance: 10001,
        }),
      ]);
    })
    .then((result) => {
      const [resultNear, resultError] = result;
      const { message } = resultError.body;
      const [nearFriend] = resultNear.body;
      expect(nearFriend.friends).to.include(user._id);
      expect(message).to.equal('Not Found');
      done();
    })
    .catch(done);
  });

  it('should find nearest events', (done) => {
    let userOne;
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/users/')
      .send(user),
      requestApp.post('/api/events/')
      .send(event),
    ])
    .then((responses) => {
      const [firstRes] = responses;
      userOne = firstRes.body;
      return requestApp
      .post(`/api/users/${userOne._id}/find-nearest-events`)
      .send({
        minDistance: 0,
        maxDistance: 1000,
      });
    })
    .then((result) => {
      const { body } = result;
      expect(body.length).to.be.above(0);
      done();
    })
    .catch(done);
  });

  it('should find nearest friends coordinates', (done) => {
    let userOne;
    let userTwo;
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/users/')
      .send(user),
      requestApp.post('/api/users/')
      .send(user),
    ])
    .then((responses) => {
      const [firstRes, secondRes] = responses;
      userOne = firstRes.body;
      userTwo = secondRes.body;
      return requestApp
      .post(`/api/users/${userOne._id}/send-request/${userTwo._id}`);
    })
    .then(() => requestApp.post(`/api/users/${userTwo._id}/approve-request/${userOne._id}`))
    .then((result) => {
      const [userApprove] = result.body;
      user._id = userApprove._id;
      return requestApp
        .post(`/api/users/${userApprove._id}/find-nearest-friends-coordinates`)
        .send({
          minDistance: 0,
          maxDistance: 1000,
        });
    })
    .then((friendsCoords) => {
      const [resultNear] = friendsCoords.body;
      expect(resultNear).to.have.property('_id');
      expect(resultNear).to.have.property('location');
      expect(resultNear).to.not.have.property('username');
      done();
    })
    .catch(done);
  });

  it('should find location and id from user', (done) => {
    let userOne;
    const requestApp = request(app);
    Promise.all([
      requestApp.post('/api/users/')
      .send(user),
      requestApp.post('/api/users/')
      .send(user),
    ])
    .then((responses) => {
      const [firstRes] = responses;
      userOne = firstRes.body;
      return requestApp
      .post(`/api/users/${userOne._id}/find-nearest-coordinates`)
      .send({
        minDistance: 0,
        maxDistance: 200,
      });
    })
    .then((result) => {
      const [firstUser] = result.body;
      expect(firstUser).to.have.property('_id');
      expect(firstUser).to.have.property('location');
      expect(firstUser).to.not.have.property('username');
      done();
    })
    .catch(done);
  });

  it('should get users position', (done) => {
    const requestApp = request(app);
    requestApp
    .post('/api/users/')
    .send(user)
    .then((response) => {
      const userId = response.body._id;
      return requestApp.get(`/api/users/${userId}/get-position`);
    })
    .then((getLocation) => {
      const [latRes, lngRes] = getLocation.body;
      const [userLat, userLng] = user.location.geo.coordinates;
      expect(latRes).to.equal(userLat);
      expect(lngRes).to.equal(userLng);
      done();
    })
    .catch(done);
  });
});
