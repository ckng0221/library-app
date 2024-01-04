import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client) {
    // console.log(client);
    this.server.emit('connected', {});

    // console.log('Connected');

    // Handle connection event
  }

  handleDisconnect(client) {
    // Handle disconnection event
    this.server.emit('disconnected', {});

    // console.log('Disconnected');
  }

  emitEvent(event: string, payload) {
    this.server.emit(event, payload);
    console.log('Emitted socket event', event);
  }
}
