import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.APP_CORS_ORIGIN || '*',
    credentials: true,
  },
  namespace: '/alerts',
})
export class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AlertsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connected', { message: 'Connected to alerts stream' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitNewAlert(alert: any) {
    this.server.emit('new-alert', alert);
    this.logger.log(`Emitted new alert: ${alert.id}`);
  }

  emitNewToken(token: any) {
    this.server.emit('new-token', token);
    this.logger.log(`Emitted new token: ${token.id}`);
  }
}

