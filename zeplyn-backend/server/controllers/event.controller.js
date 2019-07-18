import Event from '../models/events.model';

function load(req, res, next, id) {
  Event.get(id)
    .then((event) => {
      req.event = event; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return res.json(req.event);
}

function create(req, res, next) {
  const { body } = req;
  const eventCreate = new Event({
    name: body.name,
    subtitle: body.subtitle,
    price: body.price,
    image: body.image,
    description: body.description,
    category: body.category,
    website: body.website,
    address: body.address,
    openingHours: {
      open: body.openingHours.open,
      close: body.openingHours.close,
    },
    location: {
      type: 'Point',
      coordinates: body.location.coordinates,
    },
    date: {
      start: body.date.start,
      finished: body.date.finished,
    },
    participants: body.participants,
  });
  eventCreate.save()
    .then(savedEvent => res.json(savedEvent))
    .catch(e => next(e));
}

function update(req, res, next) {
  const { event, body } = req;
  event.name = body.name;
  event.subtitle = body.subtitle;
  event.price = body.price;
  event.image = body.image;
  event.description = body.description;
  event.category = body.category;
  event.website = body.website;
  event.openingHours.open = body.openingHours.open;
  event.openingHours.close = body.openingHours.close;
  event.date.start = body.date.start;
  event.date.finished = body.date.finished;
  event.address = body.address;
  event.participants = body.participants;
  event.location.coordinates = body.location.coordinates;
  event.save()
    .then(savedEvent => res.json(savedEvent))
    .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Event.list({ limit, skip })
    .then((events) => {
      res.set('X-Total-Count', events.length);
      res.set('Access-Control-Expose-Headers', 'X-Total-Count');
      res.json(events);
    })
    .catch(e => next(e));
}

function remove(req, res, next) {
  const event = req.event;
  event.remove()
    .then(deletedEvent => res.json(deletedEvent))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
