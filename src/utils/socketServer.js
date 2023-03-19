import { Server as SocketServer } from 'socket.io';

// inicializar un servidor de socket
export function initSocketServer (server) { // resive el servidor http
  // crear una instancia de un servidor socket
  const io = new SocketServer(server, {
    cors: {
      origin: '*'
    }
  });

  return io; // retornar el servidor socket
}
