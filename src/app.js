import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { initSocketServer } from './utils/index.js';
import { authRoutes, userRoutes, chatRoutes } from './routes/index.js';
// import bodyParser from 'body-parser';

const app = express(); // iniciar una app de express
const server = http.createServer(app); // crear un servidor http y pasarle la app de express
const io = initSocketServer(server); // inicializar el servidor socket

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
const baseUrl = '/api/v1';
app.use(baseUrl, authRoutes);
app.use(baseUrl, userRoutes);
app.use(baseUrl, chatRoutes);

// exportar el servidor http y el y el servidor de socket.io
export { server, io };
