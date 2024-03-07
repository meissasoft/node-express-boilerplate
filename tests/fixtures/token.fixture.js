import moment from 'moment';
import { jwt } from '../../src/config/config';
import token from '../../src/config/tokens';
import tokenSvc from '../../src/services/token.service';
import userFixture from './user.fixture';

const accessTokenExpires = moment().add(jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenSvc.generateToken(userFixture.userOne._id, accessTokenExpires, token.tokenTypes.ACCESS);
const adminAccessToken = tokenSvc.generateToken(userFixture.admin._id, accessTokenExpires, token.tokenTypes.ACCESS);

export default {
  userOneAccessToken,
  adminAccessToken,
};
