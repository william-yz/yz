import * as express from 'express';
import * as bodyParser from 'body-parser';
import apiRoutes from './apiRoutes';

const server = express();
server.use(bodyParser.json());

apiRoutes(server);
export default server;
