import resource from 'resource-router-middleware';


export default ({ config, db }) => {
	let router = resource({

		/** Property name to store preloaded entity on `request`. */
		id : 'tags',

		/** For requests with an `id`, you can auto-load the entity.
		 *  Errors terminate the request, success sets `req[id] = data`.
		 */
		load(req, id, callback) {
			let tag = db.model('tags').find( {"_id" : id}).then((tag) =>{
				callback(null, tag);
			},(err) => {
				callback(err, null);
			} )

		},

		/** GET / - List all entities */
		index({ params }, res) {
			let tags = db.model('tags').find({}).then((data) => res.json(data),(err) => res.status(500).json({error : "Something went wrong."}))
		},

		/** POST / - Create a new entity */
		create({body}, res) {
			let Tag = db.model('tags');
			let tag = new Tag(body);
			tag.save((err) => {
				if (err) throw err;
				res.json(tag);
			})
		},

		/** GET /:id - Return a given entity */
		read({ tags }, res) {
			console.log('tag: ', tags);
			res.json(tags);
		},

		/** PUT /:id - Update a given entity */
		update({ tag, body }, res) {
			for (let key in body) {
				if (key!=='id') {
					tag[key] = body[key];
				}
			}
			tag.save((err) => {
				if(err) throw err;
				res.json(tag);
			});
		},

		/** DELETE /:id - Delete a given entity */
		delete({ tag }, res) {
			tag.isDeleted = true;
			tag.save((err) => {
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
// 	id : 'tags',
//
// 	/** For requests with an `id`, you can auto-load the entity.
// 	 *  Errors terminate the request, success sets `req[id] = data`.
// 	 */
// 	load(req, id, callback) {
// 		let tag = db.model('tags').find( {"_id" : id}).then((tag) =>{
// 			callback(null, tag);
// 		},(err) => {
// 			callback(err, null);
// 		} )
//
// 	},
//
// 	/** GET / - List all entities */
// 	index({ params }, res) {
//     let tags = db.model('tags').find({}).then((data) => res.json(data),(err) => console.error(err))
// 	},
//
// 	/** POST / - Create a new entity */
// 	create({body}, res) {
// 		let tag = db.model('tags');
// 		let tag = new tag(body);
// 		tag.password = tag.generateHash(tag.password);
// 		tag.save((err) => {
// 			if (err) throw err;
// 			res.json(tag);
// 		})
// 	},
//
// 	/** GET /:id - Return a given entity */
// 	read({ tags }, res) {
// 		console.log('tag: ', tags);
// 		res.json(tags);
// 	},
//
// 	/** PUT /:id - Update a given entity */
// 	update({ tag, body }, res) {
// 		for (let key in body) {
// 			if (key!=='id') {
// 				tag[key] = body[key];
// 			}
// 		}
//
// 		res.json({"tag": tag, "body" : body});
// 	},
//
// 	/** DELETE /:id - Delete a given entity */
// 	delete({ tag }, res) {
// 		tags.splice(tags.indexOf(tag), 1);
// 		res.sendStatus(204);
// 	}
// });
