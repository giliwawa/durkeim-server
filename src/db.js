import mongoose from 'mongoose';
import models from './models'

export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	if(process.env.NODE_ENV !== 'test'){
		console.log(process.env.DB);
		if(process.env.DB === 'remote') mongoose.connect('mongodb://alaa.ksontini:alborosie123@ds161410.mlab.com:61410/acropol');
		else mongoose.connect('mongodb://localhost/acropol');
	}else {
		mongoose.connect('mongodb://localhost/acropol-test');
	}
	callback(mongoose.connection);
}
