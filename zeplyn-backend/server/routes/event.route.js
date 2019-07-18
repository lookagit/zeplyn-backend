import express from 'express';
import validate from 'express-validation';
import eventCtrl from '../controllers/event.controller';
import paramValidation from '../../config/param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/events - Get list of events */
 .get(eventCtrl.list)

 /** POST /api/events - Get list of events */
 .post(validate(paramValidation.createEvent), eventCtrl.create);

router.route('/:eventId')
  /** Get /api/events/:eventId - Get event */
  .get(eventCtrl.get)

  /** PUT /api/events/eventId - Update event */
  .put(validate(paramValidation.updateEvent), eventCtrl.update)

  /** DELETE /api/events/:eventId - Delete event */
  .delete(eventCtrl.remove);

/** Load event when API with eventId route parameter is hit */
router.param('eventId', eventCtrl.load);

export default router;
