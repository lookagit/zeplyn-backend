import Group from '../models/group.model';

function load(req, res, next, id) {
  Group.get(id)
    .then((group) => {
      req.group = group; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return res.json(req.group);
}

function create(req, res, next) {
  const { body } = req;
  const groupCreate = new Group({
    name: body.name,
    description: body.description,
    category: body.category,
    avatar: body.avatar,
    participants: [],
  });
  groupCreate.save()
    .then(savedGroup => res.json(savedGroup))
    .catch(e => next(e));
}

function update(req, res, next) {
  const { group, body } = req;
  group.name = body.name;
  group.description = body.description;
  group.createdAt = body.createdAt;
  group.avatar = body.avatar;
  group.save()
    .then(savedGroup => res.json(savedGroup))
    .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Group.list({ limit, skip })
    .then((groups) => {
      res.set('X-Total-Count', groups.length);
      res.set('Access-Control-Expose-Headers', 'X-Total-Count');
      res.json(groups);
    })
    .catch(e => next(e));
}

function remove(req, res, next) {
  const { group } = req;
  group.remove()
    .then(deletedGroup => res.json(deletedGroup))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
