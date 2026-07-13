export interface Connection {
  socketId: string;
  connectedAt: Date;
  status: 'connected' | 'disconnected';
}
