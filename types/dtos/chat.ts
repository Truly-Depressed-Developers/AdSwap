import { Message, Prisma } from '@prisma/client';
import { AdspaceDTO, mapAdspaceToDTO } from './adspace';
import { UserDTO, mapUserToDTO } from './user';
import { BusinessData, BusinessDTO, mapBusinessToDTO } from './business';

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
    logoUrl?: string;
  } | null;
};

export type ChatWithMessagesAndContextDTO = ChatDTO & {
  messages: MessageDTO[];
  businessContext: BusinessDTO;
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

type ChatWithRelationsAndDetails = ChatWithRelations & {
  messages: Message[];
  business: BusinessData;
};

export const mapMessageToDTO = (message: Message): MessageDTO => ({
  id: message.id,
  chatId: message.chatId,
  senderId: message.senderId,
  content: message.content,
  isRead: message.isRead,
  timestamp: message.timestamp,
});

export const mapChatToDTO = (chat: ChatWithRelations, unreadCount = 0): ChatDTO => {
  const participants = chat.participants.map(mapUserToDTO);
  const lastMessage = chat.messages[0] ? mapMessageToDTO(chat.messages[0]) : null;

  const firstAdspace = chat.adspaces[0];
  const businessContext = firstAdspace?.business
    ? {
        name: firstAdspace.business.name,
        logoUrl: firstAdspace.business.logoUrl || undefined,
      }
    : null;

  return {
    id: chat.id,
    participants: participants as [UserDTO, UserDTO],
    connectedAdspaces: chat.adspaces.map(mapAdspaceToDTO),
    lastMessage,
    unreadCount,
    businessContext,
  };
};

export const mapChatWithMessagesToDTO = (
  chat: ChatWithRelationsAndDetails,
): ChatWithMessagesAndContextDTO => {
  const baseChatDTO = mapChatToDTO(chat);
  const messagesDTO = chat.messages.map(mapMessageToDTO);

  return {
    ...baseChatDTO,
    messages: messagesDTO,
    businessContext: mapBusinessToDTO(chat.business),
  };
};
