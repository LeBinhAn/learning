import { Injectable, Logger } from '@nestjs/common';
import { Connection } from './connection.model';

@Injectable()
export class ConnectionManager {
  private readonly logger = new Logger(ConnectionManager.name);
  private readonly connections = new Map<string, Connection>();

  registerConnection(socketId: string): Connection {
    const connection: Connection = {
      socketId,
      connectedAt: new Date(),
      status: 'connected',
    };
    this.connections.set(socketId, connection);
    this.logger.log(`Connection registered: ${socketId}`);
    return connection;
  }

  removeConnection(socketId: string): Connection | undefined {
    const connection = this.connections.get(socketId);
    if (connection) {
      connection.status = 'disconnected';
      this.connections.delete(socketId);
      this.logger.log(`Connection removed: ${socketId}`);
    }
    return connection;
  }

  getConnection(socketId: string): Connection | undefined {
    return this.connections.get(socketId);
  }

  getActiveConnections(): Connection[] {
    return Array.from(this.connections.values());
  }
}
