import moement from 'moment';
import jwt from 'jwt-simple';

export default (app, user_id) => {
  const expires = moment().add(2,'days').valueOf();
  const token = jwt.encode({
    iss: user._id,
    exp: expires
  },app.get('jwtTokenSecret'));

  return token;
}
