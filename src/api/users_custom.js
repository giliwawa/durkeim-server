import {Router} from 'express';


let router = Router();

export default ({ config, db, app }) => {

  router.get('/me', (req, res) => {
    res.status(200).json({
      user_info 		: req.user.user_info,
      general_info 	: req.user.general_info,
      interests			: req.user.interests
    });
  })

  return router;

}
