import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import User from '../../models/user.model';
import Config from '../../../config/config';
import { generateAuthTokenForUser, generateRefreshTokenForUser } from '../../helpers/JWTTokens';

passport.use(new FacebookStrategy({
  clientID: Config.facebook.app_id,
  clientSecret: Config.facebook.app_secret,
  callbackURL: Config.facebook.callback,
  profileFields: ['id', 'displayName', 'picture', 'email', 'profileUrl', 'about', 'work']
},
(fbAccessToken, fbRefreshToken, profile, done) => {
  const zeplynAuthToken = generateAuthTokenForUser(profile);
  const zeplynRefreshToken = generateRefreshTokenForUser(profile);
  User.findOne(
    { email: profile._json && profile._json.email },
    {},
    (err, user) => {
      if (err) {
        return done(err);
      } else if (user) {
        return done(null, user);
      }
      const userInsert = new User({
        email: profile._json.email,
        username: profile.displayName,
        authToken: zeplynAuthToken,
        refreshToken: zeplynRefreshToken,
        avatar: profile._json.picture.data.url,
        socialNetwork: 'facebook',
        profile: [{
          bio: profile._json.about,
          job: `${profile._json.work[0].employer.name} - ${profile._json.work[0].position.name}`,
          website: ''
        }],
        experiences: profile._json.work.map(experience => ({
          from: experience.start_date,
          to: experience.end_date,
          job: `${experience.employer.name} - ${experience.position.name}`,
        }))
      });
      return userInsert.save((error, result) => {
        if (error) {
          return done(error);
        }
        return done(null, result);
      });
    });
}
));

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));

export default passport;

