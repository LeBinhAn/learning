import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoom } from './chat-room.service';

describe('ChatRoom', () => {
  let chatRoom: ChatRoom;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRoom],
    }).compile();

    chatRoom = module.get<ChatRoom>(ChatRoom);
  });

  it('should be defined', () => {
    expect(chatRoom).toBeDefined();
  });

  describe('isNicknameTaken', () => {
    beforeEach(() => {
      chatRoom.addParticipant({
        nickname: 'Alice',
        joinedAt: new Date(),
        connection: {
          socketId: 'socket-alice',
          connectedAt: new Date(),
          status: 'connected',
        },
      });
    });

    it('should return true for identical nickname', () => {
      expect(chatRoom.isNicknameTaken('Alice')).toBe(true);
    });

    it('should return true for identical nickname with different case', () => {
      expect(chatRoom.isNicknameTaken('alice')).toBe(true);
      expect(chatRoom.isNicknameTaken('ALICE')).toBe(true);
    });

    it('should return true for identical nickname with extra whitespaces', () => {
      expect(chatRoom.isNicknameTaken('  Alice  ')).toBe(true);
    });

    it('should return false for different nickname', () => {
      expect(chatRoom.isNicknameTaken('Bob')).toBe(false);
    });

    it('should return false if the nickname is taken but the socket ID matches the excluded socket ID', () => {
      expect(chatRoom.isNicknameTaken('Alice', 'socket-alice')).toBe(false);
    });

    it('should return true if the nickname is taken and the excluded socket ID is different', () => {
      expect(chatRoom.isNicknameTaken('Alice', 'socket-bob')).toBe(true);
    });
  });
});
