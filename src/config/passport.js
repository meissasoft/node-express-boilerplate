import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { jwt } from './config';
import token from './tokens';
import { User } from '../models';

const jwtOptions = {
  secretOrKey: jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== token.tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default {
  jwtStrategy,
};
