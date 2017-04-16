import {Router} from 'express';
import jwt from 'jwt-simple';
import moment from 'moment';
import clearbit from 'clearbit';
import validator from '../validators/user';
import util from 'util';

let router = Router();

export default ({config, db, app}) => {
  let User = db.model('users');
  router.post('/login', (req,res,next)=>{
    req.checkBody(validator.loginValidator);
    req.getValidationResult().then((result) => {
      if(!result.isEmpty()){
        res.status(400).json(result.array());
        return;
      }
      User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
          // user not found
          return res.status(401).json({error: 'user not found'});
        }

        if (!user) {
          // incorrect username
          return res.status(401).json({error: 'Invalid username or password'});
        }

        if (!user.validPassword(req.body.password)) {
          // incorrect password
          return res.status(401).json({error: 'Invalid username or password'});
        }

        // User has authenticated OK
        const expires = moment().add(2,'days').valueOf();
        const token = jwt.encode({
          iss: user._id,
          exp: expires
        },app.get('jwtTokenSecret'));
        res.json({
          token: token,
          expires: expires,
          user: user.toJSON()
        });
      });

    })


  })

  //Enrichment
  // Get request to /enrichment/person?email=[email]
  // returns information
  // TODO Handle QueuedError and no data found.

  router.get("/enrichment", (req, res, next)=>{
    let cb = clearbit(config.clearbit.key);
    cb.Enrichment.find({email: req.query.email}).then((data) => {
      res.json(data);
    }).catch(cb.Enrichment.QueuedError, (err) => console.error(err))
    .catch((err) => console.error(err));
  });


  return router;
}
