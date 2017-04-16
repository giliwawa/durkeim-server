import { Router } from 'express';
import testChat from './testChat';

export default ({ config, db }) => {
	let routes = Router();
	// add middleware here

	
	//routes.use(testChat);


	return routes;
}
