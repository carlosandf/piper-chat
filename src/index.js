import mongoose from 'mongoose';
import { server, io } from './app.js';
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
      console.log(`| http://${IP_SERVER}:${PORT}/api                  |`);
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
  });
