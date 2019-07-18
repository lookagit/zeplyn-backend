import faker from 'faker';
import User from '../server/models/user.model';
import Event from '../server/models/events.model';
import Group from '../server/models/group.model';

function generateGroup() {
  const group = new Group({
    name: faker.lorem.word(),
    description: faker.lorem.words(),
    avatar: faker.internet.avatar(),
  });
  return group;
}

function createFakeGroup(req, res, next) {
  generateGroup().save()
    .then(createdGroup => res.json(createdGroup))
    .catch(e => next(e));
}

function generateEvent() {
  const event = new Event({
    name: faker.lorem.word(),
    description: faker.lorem.words(),
    category: faker.lorem.word(),
    website: 'www.faker.com',
    openingHours: {
      open: 0,
      close: 14,
    },
    location: {
      coordinates: [faker.random.number(), faker.random.number()],
    },
    date: {
      start: faker.date.recent(),
      finished: faker.date.recent(),
    },
  });
  return event;
}

function createFakeEvent(req, res, next) {
  generateEvent().save()
    .then(createdEvent => res.json(createdEvent))
    .catch(e => next(e));
}

function generateUser() {
  const user = new User({
    username: faker.name.findName(),
    email: faker.internet.email(),
    authToken: 'xxx',
    refreshToken: 'xxx',
    socialNetwork: 'faker',
    profile: {
      job: faker.name.jobTitle(),
      bio: faker.name.job,
      website: 'www.faker.com'
    },
    experience: [
      {
        from: faker.date.past(),
        to: faker.date.recent(),
        job: faker.name.jobTitle()
      },
      {
        from: faker.date.past(),
        to: faker.date.recent(),
        job: faker.name.jobTitle()
      }
    ],
    avatar: faker.internet.avatar(),
    phone: '1234567891', // faker.phone.phoneNumber().replace('-', ''),
    location: {
      geo: {
        type: 'Point',
        coordinates: [
          parseFloat(faker.address.longitude()),
          parseFloat(faker.address.latitude())
        ] // TODO: better values
      }
    },
    locationProvider: 'faker',
    status: 'available'
  });

  return user;
}

function create1FakeUser(req, res, next) {
  generateUser().save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

function create10FakeUser(req, res, next) {
  const users = [];
  for (let i = 0; i < 10; i += 1) {
    users.push(generateUser());
  }

  User.create(users)
    .then(rUsers => res.json(rUsers))
    .catch(e => next(e));
}

function create10BlockedUsers(req, res, next) {
  const schemaUsers = [];
  for (let i = 0; i < 10; i += 1) {
    schemaUsers.push(generateUser());
  }

  User.create(schemaUsers)
    .then((users) => {
      const user = users[users.length - 1];
      return Promise.all(users.map(r => user.block(r)));
    })
    .then(users => res.json(users[0]))
    .catch(e => next(e));
}

function createFriends(req, res, next) {
  const schemaUsers = [];
  for (let i = 0; i < 2; i += 1) {
    schemaUsers.push(generateUser());
  }

  User.create(schemaUsers)
    .then((friends) => {
      const [friendOne, friendTwo] = friends;
      return friendOne.addFriends(friendTwo);
    })
    .then(friends => res.json(friends[0]))
    .catch(e => next(e));
}

function joinGroup(req, res, next) {
  const groupUsers = [];
  for (let i = 0; i < 2; i += 1) {
    groupUsers.push(generateUser());
  }
  const groupItem = generateGroup();

  User.create(groupUsers)
  .then((usersForGroup) => {
    Group.create(groupItem)
    .then(savedGroup => Promise.all(usersForGroup.map(item => item.joinGroup(savedGroup))))
    .then(group => res.json(group))
    .catch(e => next(e));
  });
}

function createUserEvent(req, res, next) {
  const user = generateUser();
  const event = generateEvent();

  User.create(user)
    .then((createdUser) => {
      Event.create(event)
        .then(createdEvent => createdUser.followEvent(createdEvent))
        .then(result => res.json(result))
        .catch(e => next(e));
    });
}

function removeUserEvent(req, res, next) {
  const user = generateUser();
  const event = generateEvent();
  User.create(user)
     .then((createdUser) => {
       Event.create(event)
          .then(createdEvent => createdUser.followEvent(createdEvent))
          .then((creatingResult) => {
            const [eventRes, userRes] = creatingResult;
            return userRes.unfollowUserEvent(eventRes);
          })
          .then(result => res.json(result))
          .catch(e => next(e));
     });
}

function removeUserFriend(req, res, next) {
  const schemaUsers = [];
  for (let i = 0; i < 2; i += 1) {
    schemaUsers.push(generateUser());
  }
  User.create(schemaUsers)
    .then((friends) => {
      const [friendOne, friendTwo] = friends;
      return friendOne.addFriends(friendTwo);
    })
    .then((friends) => {
      const [unfriendFirst, unfriendSecond] = friends;
      return unfriendFirst.removeUserFriend(unfriendSecond);
    })
    .then(result => res.json(result))
    .catch(e => next(e));
}

function unblockUser(req, res, next) {
  const schemaUsers = [];
  for (let i = 0; i < 2; i += 1) {
    schemaUsers.push(generateUser());
  }

  User.create(schemaUsers)
    .then((users) => {
      const user = users[users.length - 1];
      return Promise.all(users.map(r => user.block(r)));
    })
    .then((usersBlock) => {
      const [firstUser] = usersBlock;
      return Promise.all([firstUser.unblockUser(firstUser)]);
    })
    .then(result => res.json(result))
    .catch(e => next(e));
}

function updatePosition(req, res, next) {
  const user = generateUser();
  User.create(user)
    .then((userCreated) => userCreated.updatePosition(userCreated, [10, 10]))
    .then(result => res.json(result))
    .catch(e => next(e));
}

export default {
  create1FakeUser,
  create10FakeUser,
  create10BlockedUsers,
  createFakeEvent,
  createFakeGroup,
  createFriends,
  joinGroup,
  createUserEvent,
  removeUserEvent,
  removeUserFriend,
  unblockUser,
  updatePosition,
};
