import { Injectable, Logger } from '@nestjs/common';
import { Participant } from './participant.model';

@Injectable()
export class ChatRoom {
  private readonly logger = new Logger(ChatRoom.name);
  private readonly participants = new Map<string, Participant>(); // key is socketId

  addParticipant(participant: Participant): void {
    this.participants.set(participant.connection.socketId, participant);
    this.logger.log(
      `Participant joined: ${participant.nickname} (${participant.connection.socketId})`,
    );
  }

  removeParticipant(socketId: string): Participant | undefined {
    const participant = this.participants.get(socketId);
    if (participant) {
      this.participants.delete(socketId);
      this.logger.log(
        `Participant left: ${participant.nickname} (${socketId})`,
      );
    }
    return participant;
  }

  getParticipant(socketId: string): Participant | undefined {
    return this.participants.get(socketId);
  }

  getParticipants(): Participant[] {
    return Array.from(this.participants.values());
  }
}
