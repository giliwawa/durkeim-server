import Validator from '../validators/user';
import util from 'util';
import resource from 'resource-router-middleware';
import generateJwt from '../lib/generateJwt'

export default ({ config, db, app}) => {
	let router = resource({

		/** Property name to store preloaded entity on `request`. */
		id : 'users',

		/** For requests with an `id`, you can auto-load the entity.
		*  Errors terminate the request, success sets `req[id] = data`.
		*/
		load(req, id, callback) {
			let user = db.model('users').findOne( {"_id" : id, isDeleted: false}).then((user) =>{
				callback(null, user);
			},(err) => {
				callback(err, null);
			} )

		},

		/** GET / - List all entities */
		index({ params }, res) {
			db.model('users')
			.find({})
			.then((data) =>{
				res.json(data);
			},(err) => {
				res.json({error : err})
			});
		},


		/**
		* Creates a new user
		* @param  {request} req Express Request Object
		* @param  {Response} res Express Response Object
		*/
		create(req, res) {
			let User = db.model('users');

			//Validate request body
			req.checkBody(Validator.entityValidator);

			req.getValidationResult().then((result) => {

				if(!result.isEmpty()){
					res.status(400).json(result.array());
					return;
				}

				let user = new User(req.body);
				user.password = user.generateHash(user.password);
				user.save((err) => {
					if (err) {
						console.log(err);
						res.send(500);
					}
					res.json({
						token : generateJwt(app, user._id),
						user_info : user.user_info,
						interests : user.interests || [],
						general_info : user.general_info,
					});
				})

			})

		},


		/**
		* GET /users/:id Get user by id
		* @param  {User} users user matching the :id
		* @param  {Response} res   Express Response Object
		*/
		read({ users }, res) {

			res.json(users);
		},

		/**
		* PUT /users/:id Updates the user by the given :id
		* @param  {User} user User model
		* @param  {Object} body Request body
		* @param  {Response} res  Response Object
		*/
		update({ user, body }, res) {
			for (let key in body) {
				if (key!=='id') {
					user[key] = body[key];
				}
			}
			user.save((err) => {
				if(err) throw err;
				res.json(user);
			});
		},

		/** DELETE /:id - Delete a given entity */
		delete({ user }, res) {
			user.isDeleted = true;
			user.save((err) => {
				if(err) throw err;
				res.sendStatus(204);
			});

		},

		

		});



		return router;
	}
