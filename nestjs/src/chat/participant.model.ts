import { Connection } from '../connection/connection.model';

export interface Participant {
  nickname: string;
  joinedAt: Date;
  connection: Connection;
}
