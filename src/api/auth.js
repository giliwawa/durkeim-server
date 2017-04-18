import {Router} from 'express';
import jwt from 'jwt-simple';
import moment from 'moment';
import clearbit from 'clearbit';
import validator from '../validators/user';
import generateJwt from '../lib/generateJwt'
import userTransformer from '../lib/enrichementToUser'

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
      User.findOne({ "user_info.email": req.body.email }, function(err, user) {
        if (err) {
          // user not found
          return res.status(401).json({error: 'user not found'});
        }

        if (!user) {
          console.error("NO USER FOUND");
          return res.status(401).json({error: 'Invalid username or password'});
        }

        if (!user.validPassword(req.body.password)) {
          // incorrect password
          console.error("INVALID PASSWORD");
          return res.status(401).json({error: 'Invalid username or password'});
        }

        // User has authenticated OK

        res.status(200).json({
          token : generateJwt(app, user._id),
          user_info : user.user_info,
          interests : user.interests || [],
          general_info : user.general_info,
        });
        // const expires = moment().add(2,'days').valueOf();
        // const token = jwt.encode({
        //   iss: user._id,
        //   exp: expires
        // },app.get('jwtTokenSecret'));
        // res.json({
        //   token: token,
        //   expires: expires,
        //   user: user.toJSON()
        // });
      });

    })


  })

  //Enrichment
  // Get request to /enrichment/person?email=[email]
  // returns information
  // TODO Handle QueuedError and no data found.

  router.get("/enrichment", (req, res, next)=>{
    let cb = clearbit(config.clearbit.key);
    console.log(userTransformer);
    cb.Enrichment.find({email: req.query.email}).then((data) => {
      res.status(200).json(userTransformer(data));
    })
    .catch(cb.Enrichment.QueuedError, (err) => res.json({error :'QueuedError'}))
    .catch((err) => res.json({error : 'No data found'}));
  });


  return router;
}
