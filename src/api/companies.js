import Validator from '../validators/company';
import util from 'util';
import resource from 'resource-router-middleware';

export default ({ config, db, app}) => {
	let router = resource({

		/** Property name to store preloaded entity on `request`. */
		id : 'companies',

		/** For requests with an `id`, you can auto-load the entity.
		*  Errors terminate the request, success sets `req[id] = data`.
		*/
		load(req, id, callback) {
			let company = db.model('companies').findOne( {"_id" : id, isDeleted: false}).then((company) =>{
				callback(null, company);
			},(err) => {
				callback(err, null);
			} )

		},

		/** GET / - List all entities */
		index({ params }, res) {
			db.model('companies')
			.find({})
			.then((data) =>{
				res.json(data);
			},(err) => {
				res.json({error : err})
			});
		},


		/**
		* Creates a new company
		* @param  {request} req Express Request Object
		* @param  {Response} res Express Response Object
		*/
		create(req, res) {
			let Company = db.model('companies');

			//Validate request body
			req.checkBody(Validator.entityValidator);

			req.getValidationResult().then((result) => {

				if(!result.isEmpty()){
					res.status(400).json(result.array());
					return;
				}

				let company = new Company(req.body);
        company.owner_id = req.user._id
				company.save((err) => {
					if (err) {
						console.log(err);
						res.send(500);
					}
					res.status(201).end();
				})

			})

		},


		/**
		* GET /companies/:id Get company by id
		* @param  {company} companies company matching the :id
		* @param  {Response} res   Express Response Object
		*/
		read({ companies }, res) {

			res.json(companies);
		},

		/**
		* PUT /companies/:id Updates the company by the given :id
		* @param  {company} company company model
		* @param  {Object} body Request body
		* @param  {Response} res  Response Object
		*/
		update({ company, body }, res) {
			for (let key in body) {
				if (key!=='id') {
					company[key] = body[key];
				}
			}
			company.save((err) => {
				if(err) throw err;
				res.json(company);
			});
		},

		/** DELETE /:id - Delete a given entity */
		delete({ company }, res) {
			company.isDeleted = true;
			company.save((err) => {
				if(err) throw err;
				res.sendStatus(204);
			});

		},

		// "custom":{
		// 	/**
		// 	* Register all custom get routes
		// 	* @type {Object}
		// 	*/
		// 	get : {
    //
		// 		/**
		// 		* GET /companies/me get the current company profile
		// 		* @param  {Request} req Express Request Object
		// 		* @param  {Response} res Express Response Object
		// 		*/
		// 		me(req,res){
		// 			res.status(200).json({
		// 				company_info 		: req.company.company_info,
		// 				general_info 	: req.company.general_info,
		// 				interests			: req.company.interests
		// 			})
		// 		},
    //
    //
		// 	},
		// }

		});



		return router;
	}
