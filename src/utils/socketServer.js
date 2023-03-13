import { Server as SocketServer } from 'socket.io';

// export let io = null;

export function initSocketServer (server) {
  const io = new SocketServer(server, {
    cors: {
      origin: '*'
    }
  });

  return io;
}
