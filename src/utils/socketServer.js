import { Server as SocketServer } from 'socket.io';

export let io = null;
// inicializar un servidor de socket
export function initSocketServer (server) { // resive el servidor http
  // crear una instancia de un servidor socket
  io = new SocketServer(server, {
    cors: {
      origin: '*'
    }
  });
}
