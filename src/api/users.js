import Validator from '../validators/user';
import util from 'util';
import resource from 'resource-router-middleware';

export default ({ config, db }) => {
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


		/** POST / - Create a new entity */
		// TODO: log user in after signup
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
					if (err) throw err;
					res.json(user);
				})

			})

		},

		/** GET /:id - Return a given entity */
		read({ users }, res) {

			res.json(users);
		},

		/** PUT /:id - Update a given entity */
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
		}
	});

	return router;
}



// resource({
//
// 	/** Property name to store preloaded entity on `request`. */
// 	id : 'users',
//
// 	/** For requests with an `id`, you can auto-load the entity.
// 	 *  Errors terminate the request, success sets `req[id] = data`.
// 	 */
// 	load(req, id, callback) {
// 		let user = db.model('users').find( {"_id" : id}).then((user) =>{
// 			callback(null, user);
// 		},(err) => {
// 			callback(err, null);
// 		} )
//
// 	},
//
// 	/** GET / - List all entities */
// 	index({ params }, res) {
//     let users = db.model('users').find({}).then((data) => res.json(data),(err) => console.error(err))
// 	},
//
// 	/** POST / - Create a new entity */
// 	create({body}, res) {
// 		let User = db.model('users');
// 		let user = new User(body);
// 		user.password = user.generateHash(user.password);
// 		user.save((err) => {
// 			if (err) throw err;
// 			res.json(user);
// 		})
// 	},
//
// 	/** GET /:id - Return a given entity */
// 	read({ users }, res) {
// 		console.log('user: ', users);
// 		res.json(users);
// 	},
//
// 	/** PUT /:id - Update a given entity */
// 	update({ user, body }, res) {
// 		for (let key in body) {
// 			if (key!=='id') {
// 				user[key] = body[key];
// 			}
// 		}
//
// 		res.json({"user": user, "body" : body});
// 	},
//
// 	/** DELETE /:id - Delete a given entity */
// 	delete({ user }, res) {
// 		users.splice(users.indexOf(user), 1);
// 		res.sendStatus(204);
// 	}
// });
