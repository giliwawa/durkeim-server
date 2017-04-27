import resource from 'resource-router-middleware';
import {saveNewTagsFromSignal} from '../lib/signal';
import mongoose from 'mongoose';

let Signal = mongoose.model('signals');

export default ({ config, db }) => {
	let router = resource({

		/** Property name to store preloaded entity on `request`. */
		id : 'signals',

		/** For requests with an `id`, you can auto-load the entity.
		 *  Errors terminate the request, success sets `req[id] = data`.
		 */
		load(req, id, callback) {
			let signal = db.model('signals').find( {"_id" : id}).then((signal) =>{
				callback(null, signal);
			},(err) => {
				callback(err, null);
			} )

		},

		/** GET / - List all entities */
		index({ params }, res) {
			let signals = db.model('signals').find({}).then((data) => res.json(data),(err) => console.error(err))
		},

		/** POST / - Create a new entity */
		create(req, res) {

			// TODO: Add validation
			let signal = new Signal(req.body);
			//Set the owner
			signal.owner_id = req.user._id;
			//Save new tags if there is any
			if(signal.tags){

				saveNewTagsFromSignal(signal.tags)
				.then(savedTags => {

					signal.tags = savedTags;
					signal.save((err) => {
						if (err) {
							console.log(err);
							re.status(500).end()
						}
						res.status(201).end();
					})
				},
				(err) => {
					console.error(err);
					res.status(500).end()
				})
			}
		},

		/** GET /:id - Return a given entity */
		read({ signals }, res) {
			console.log('signal: ', signals);
			res.json(signals);
		},

		/** PUT /:id - Update a given entity */
		update({ signal, body }, res) {
			for (let key in body) {
				if (key!=='id') {
					signal[key] = body[key];
				}
			}
			signal.save((err) => {
				if(err) throw err;
				res.json(signal);
			});
		},

		/** DELETE /:id - Delete a given entity */
		delete({ signal }, res) {
			signal.isDeleted = true;
			signal.save((err) => {
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
// 	id : 'signals',
//
// 	/** For requests with an `id`, you can auto-load the entity.
// 	 *  Errors terminate the request, success sets `req[id] = data`.
// 	 */
// 	load(req, id, callback) {
// 		let signal = db.model('signals').find( {"_id" : id}).then((signal) =>{
// 			callback(null, signal);
// 		},(err) => {
// 			callback(err, null);
// 		} )
//
// 	},
//
// 	/** GET / - List all entities */
// 	index({ params }, res) {
//     let signals = db.model('signals').find({}).then((data) => res.json(data),(err) => console.error(err))
// 	},
//
// 	/** POST / - Create a new entity */
// 	create({body}, res) {
// 		let signal = db.model('signals');
// 		let signal = new signal(body);
// 		signal.password = signal.generateHash(signal.password);
// 		signal.save((err) => {
// 			if (err) throw err;
// 			res.json(signal);
// 		})
// 	},
//
// 	/** GET /:id - Return a given entity */
// 	read({ signals }, res) {
// 		console.log('signal: ', signals);
// 		res.json(signals);
// 	},
//
// 	/** PUT /:id - Update a given entity */
// 	update({ signal, body }, res) {
// 		for (let key in body) {
// 			if (key!=='id') {
// 				signal[key] = body[key];
// 			}
// 		}
//
// 		res.json({"signal": signal, "body" : body});
// 	},
//
// 	/** DELETE /:id - Delete a given entity */
// 	delete({ signal }, res) {
// 		signals.splice(signals.indexOf(signal), 1);
// 		res.sendStatus(204);
// 	}
// });
