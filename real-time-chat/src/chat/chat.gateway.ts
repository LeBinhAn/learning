import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectionManager } from '../connection/connection-manager.service';
import { ChatRoom } from './chat-room.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() server: Server;

  constructor(
    private readonly connectionManager: ConnectionManager,
    private readonly chatRoom: ChatRoom,
  ) {}

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.connectionManager.registerConnection(client.id);
  }

  handleDisconnect(client: Socket) {
    const socketId = client.id;
    const participant = this.chatRoom.removeParticipant(socketId);
    if (participant) {
      this.server.emit('participantLeft', {
        nickname: participant.nickname,
        leftAt: new Date(),
      });
    }
    this.connectionManager.removeConnection(socketId);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { nickname: string }) {
    const socketId = client.id;
    const connection = this.connectionManager.getConnection(socketId);

    if (!connection) {
      this.logger.error(
        `Join room failed: connection not found for socket ID ${socketId}`,
      );
      throw new WsException('Connection not found');
    }

    if (!payload || !payload.nickname) {
      throw new WsException('Nickname is required');
    }

    const participant = {
      nickname: payload.nickname,
      joinedAt: new Date(),
      connection,
    };

    this.chatRoom.addParticipant(participant);

    // Broadcast that a new participant has joined
    this.server.emit('participantJoined', {
      nickname: participant.nickname,
      joinedAt: participant.joinedAt,
    });

    return { success: true, nickname: participant.nickname };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: { message: string }): void {
    const participant = this.chatRoom.getParticipant(client.id);
    const sender = participant ? participant.nickname : 'Guest';

    this.logger.log(
      `Message from ${sender} (${client.id}): ${payload.message}`,
    );

    this.server.emit('newMessage', {
      sender,
      message: payload.message,
    });
  }
}
