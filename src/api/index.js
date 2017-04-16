import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import users from './users';
import signals from './signals';
import tags from './tags';
import auth from './auth';
import check from '../middleware/jwtCheck';

export default ({ config, db, app}) => {
	let api = Router();

	//restricted access routes Authorization check
	api.use(check({db, app}));

	// mount the facets resource
	api.use('/auth', auth({config, db, app}))
	api.use('/facets', facets({ config, db }));
	api.use('/users', users({ config, db }));
	api.use('/signals', signals({ config, db }));

	//Add api end points here


	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ "version" : "1.0.0" });
	});

	return api;
}
