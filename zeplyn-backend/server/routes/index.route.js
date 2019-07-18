import express from 'express';
import multer from 'multer';
import config from '../../config/config';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import groupRoutes from './group.route';
import eventRoutes from './event.route';
import postRoutes from './post.route';
import fakeRoutes from '../../faker/route';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

/** POST /image-upload - add file in uploads/ */
router.post('/images-upload', upload.single('file'), (req, res) => {
  res.send(JSON.stringify({ imageUrl: `http://localhost:4040/${req.file.originalname}` }));
});

// mount event routes at /events
router.use('/events', eventRoutes);

// mount post routes at /posts
router.use('/posts', postRoutes);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount group routes at /groups
router.use('/groups', groupRoutes);

if (config.env === 'development') {
  router.use('/faker', fakeRoutes);
}

export default router;
