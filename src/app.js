import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { initSocketServer } from './utils/index.js';
import { authRoutes } from './routes/index.js';
// import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);
const io = initSocketServer(server);

/*
  express < 4.16.4
  // Configure Body Paser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// configure static folder
app.use(express.static('uploads'));

// configure header http - cors
app.use(cors());

// configure logger http request
app.use(morgan('dev'));

// configure routing
app.use('/api', authRoutes);

export { server, io };
