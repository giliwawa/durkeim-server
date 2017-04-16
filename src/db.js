import mongoose from 'mongoose';
import models from './models'

export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	if(process.env.NODE_ENV !== 'test')
		mongoose.connect('mongodb://localhost/acropol');
	else {
		mongoose.connect('mongodb://localhost/acropol-test');
	}
	callback(mongoose.connection);
}
