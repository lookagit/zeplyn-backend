import jwt from 'jsonwebtoken';
import config from '../../config/config';

export function generateAuthTokenForUser(user) {
  const obj = {
    sub: user._id,
    iat: new Date().getTime()
  };

  return jwt.sign(obj, config.jwtSecret, {
    expiresIn: '10m'
  });
}

export function generateRefreshTokenForUser(user) {
  const obj = {
    sub: user._id,
    ml: user.email,
    type: 'refresh',
    iat: new Date().getTime()
  };

  return jwt.sign(obj, config.jwtSecret, {
    expiresIn: 60 * 60 * 24 * 90
  });
}
