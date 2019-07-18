import Post from '../models/posts.model';

function load(req, res, next, id) {
  Post.get(id)
    .then((post) => {
      req.post = post; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return res.json(req.post);
}

function create(req, res, next) {
  const { body } = req;
  const postCreate = new Post(body);
  postCreate.save()
    .then(savedPost => res.json(savedPost))
    .catch(e => next(e));
}

function update(req, res, next) {
  const { post, body } = req;
  const { _id, ...parsedBody } = body; // eslint-disable-line
  Post.findOneAndUpdate(
    { _id: post._id },
    parsedBody,
    { new: true }
  )
  .then(savedPost => res.json(savedPost))
  .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Post.list({ limit, skip })
    .then((posts) => {
      res.set('X-Total-Count', posts.length);
      res.set('Access-Control-Expose-Headers', 'X-Total-Count');
      res.json(posts);
    })
    .catch(e => next(e));
}

function remove(req, res, next) {
  const post = req.post;
  post.remove()
    .then(deletedPost => res.json(deletedPost))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
