import { AdspaceDTO } from './adspace';
import { UserDTO } from './user';

type ChatDTO = {
  id: string;
  participants: [UserDTO, UserDTO];
  connectedAdspaces: AdspaceDTO[];
};

type MessageDTO = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
};

export type { ChatDTO, MessageDTO };
