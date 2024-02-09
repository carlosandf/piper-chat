import mongoose from 'mongoose';
import { server } from './app.js';
import { io } from './utils/socketServer.js';
import { IP_SERVER, PORT, MONGO_URI } from './constants.js';

mongoose.connect(MONGO_URI, { useNewUrlParser: true })
  .then(resp => {
    console.log('----------------------------------------------');
    console.log('| MongoDB Connected:                         |');
    console.log(`| ${resp.connection.host} |`);

    server.listen(PORT, () => {
      console.log('----------------------------------------------');
      console.log('| Server running                             |');
      console.log('----------------------------------------------');
      console.log(`| http://${IP_SERVER}:${PORT}/api/v1               |`);
      console.log('----------------------------------------------');

      io.on('connection', (socket) => {
        console.log('Nuevo usuario en la app');

        socket.on('disconnect', () => {
          console.log('Usuario desconectado');
        });

        socket.on('subscribe', (room) => {
          socket.join(room);
        });

        socket.on('unsubscribe', (room) => {
          socket.leave(room);
        });
      });
    });
  })
  .catch(err => {
    if (err.code && err.code === 'ECONNREFUSED') {
      console.log('----------------------------------------------');
      console.log('| ERROR: No hay conexión a internet          |');
      console.log('----------------------------------------------');
    }
  });
