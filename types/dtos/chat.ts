import { Message, Prisma } from '@prisma/client';
import { AdspaceDTO, mapAdspaceToDTO } from './adspace';
import { UserDTO, mapUserToDTO } from './user';

export type MessageDTO = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  timestamp: Date;
};

export type ChatDTO = {
  id: string;
  participants: [UserDTO, UserDTO];
  connectedAdspaces: AdspaceDTO[];
  lastMessage: MessageDTO | null;
  unreadCount: number;
  businessContext: {
    name: string;
    logoUrl?: string | null;
  } | null;
};

type ChatWithRelations = Prisma.ChatGetPayload<{
  include: {
    participants: true;
    messages: {
      take: 1;
      orderBy: { timestamp: 'desc' };
    };
    adspaces: {
      include: {
        type: true;
        business: {
          select: {
            name: true;
            logoUrl: true;
          };
        };
      };
    };
  };
}>;

export const mapMessageToDTO = (message: Message): MessageDTO => ({
  id: message.id,
  chatId: message.chatId,
  senderId: message.senderId,
  content: message.content,
  isRead: message.isRead,
  timestamp: message.timestamp,
});

export const mapChatToDTO = (chat: ChatWithRelations, unreadCount = 0): ChatDTO => {
  const participants = chat.participants.map(mapUserToDTO) as [UserDTO, UserDTO];
  const lastMessage = chat.messages[0] ? mapMessageToDTO(chat.messages[0]) : null;

  const firstAdspace = chat.adspaces[0];
  const businessContext = firstAdspace?.business
    ? {
        name: firstAdspace.business.name,
        logoUrl: firstAdspace.business.logoUrl,
      }
    : null;

  return {
    id: chat.id,
    participants,
    connectedAdspaces: chat.adspaces.map(mapAdspaceToDTO),
    lastMessage,
    unreadCount,
    businessContext,
  };
};
