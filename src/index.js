import http from 'http';
import express from 'express';
import jwt from 'jwt-simple';
import expressValidator from 'express-validator'

import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';



let app = express();
app.set('jwtTokenSecret', config.jswtSecret);
app.server = http.createServer(app);

// logger
if(process.env.NODE_ENV !=='test'){
	app.use(morgan('dev'));
	console.log('not in dev env: ',process.env.NODE_ENV)
}

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

app.use(expressValidator());

// connect to db
initializeDb( db => {

// internal middleware

app.use(middleware({ config, db }));

// api router
app.use('/api', api({ config, db, app}));

app.server.listen(process.env.PORT || config.port);

console.log(`Started on port ${app.server.address().port}`);
});

export default app;
