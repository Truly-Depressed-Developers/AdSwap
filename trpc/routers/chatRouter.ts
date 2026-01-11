import { prisma } from '@/prisma/prisma';
import { mapChatToDTO } from '@/types/dtos';
import { protectedProcedure, router } from '../init';

export const chatRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const chats = await prisma.chat.findMany({
      include: {
        participants: true,
        messages: {
          take: 1,
          orderBy: {
            timestamp: 'desc',
          },
        },
        adspaces: {
          include: {
            type: true,
            business: {
              select: {
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    const sortedChats = chats.sort((a, b) => {
      const timeA = a.messages[0]?.timestamp.getTime() ?? 0;
      const timeB = b.messages[0]?.timestamp.getTime() ?? 0;
      return timeB - timeA;
    });

    const chatsWithUnread = await Promise.all(
      sortedChats.map(async (chat) => {
        const unreadCount = await prisma.message.count({
          where: {
            chatId: chat.id,
            isRead: false,
            senderId: {
              not: ctx.user.id,
            },
          },
        });
        return { chat, unreadCount };
      }),
    );

    return chatsWithUnread.map(({ chat, unreadCount }) => mapChatToDTO(chat, unreadCount));
  }),
});
