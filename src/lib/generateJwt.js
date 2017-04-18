import moment from 'moment';
import jwt from 'jwt-simple';

export default (app, user_id) => {
  console.log(app.get('jwtTokenSecret'));
  const expires = moment().add(2,'days').valueOf();
  const token = jwt.encode({
    iss: user_id,
    exp: expires
  },app.get('jwtTokenSecret'));

  return token;
}
