import jwt from 'jwt-simple';
import {Router} from 'express';

let router = Router();
export default ({db, app}) => {


  let User = db.model('users');

  return (req, res, next) => {
    console.log(req.path,'::',req.method);

    if(req.path === "/auth/login" || (req.path ===  "/users")&&(req.method ==="POST") ) next();

    else{
      const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

      if(token){
        try{
          const decoded = jwt.decode(token,app.get('jwtTokenSecret'));

          if(Date.now() >= decoded.exp ) res.json({error : 'Token expired', code: 101});

          User.findOne({"_id" : decoded.iss}, (err,user) =>{ req.user = user; next() });

        } catch(err){
          res.status(500).json({error : err});
        }
      }else{
        res.status(401).json({error : "No Token Found." });
      }
    }


  }

}
