// import jwt from 'jsonwebtoken';
// import httpStatus from 'http-status';
// import APIError from '../helpers/APIError';
// import config from '../../config/config';

// function generateTokenForUser (user) {
//   const obj = {
//     sub: user._id,
//     iat: new Date().getTime()
//   };
//   return jwt.encode(obj, config.jwtSecret);
// }

export function facebook(req, res) {
  return res.redirect(`zeplynfrontend://login?user=${JSON.stringify(req.user)}`);
}

// TODO: Add jwtToken auth

// function requireAuth(req, res, next) {
//   var authHeader = req.get('Authorization');
//   var jwtToken = jwt.decode(authHeader, config.jwtSecret);
//   var user_id = jwtToken.sub;
//   User.findById(user_id, function(err, user) {
//     if (err) { return next(err); }
//     if (!user) { return next(new Error("User not found.")); }
//     req.user = user;
//     // return res.json({
//     //   token,
//     //   username: user.username
//     // });
//     next();
// const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
//   });
// }

export default {};
