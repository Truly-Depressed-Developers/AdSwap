import { prisma } from '@/prisma/prisma';
import { mapChatToDTO, mapChatWithMessagesToDTO } from '@/types/dtos';
import { protectedProcedure, router } from '../init';
import { findMatchingResponse } from '@/lib/chatResponses';
import { z } from 'zod';

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

  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const chat = await prisma.chat.findUnique({
      where: { id: input.id },
      include: {
        participants: true,
        messages: {
          orderBy: { timestamp: 'asc' },
        },
        adspaces: {
          include: {
            type: true,
            business: {
              include: {
                tags: true,
                owner: true,
              },
            },
          },
        },
      },
    });

    if (!chat) {
      throw new Error('Chat nie został znaleziony');
    }

    const isParticipant = chat.participants.some((p) => p.id === ctx.user.id);
    if (!isParticipant) {
      throw new Error('Nie masz dostępu do tego czatu');
    }

    const business = chat.adspaces[0]?.business;
    if (!business) {
      throw new Error('Nie znaleziono biznesu powiązanego z czatem');
    }

    return mapChatWithMessagesToDTO({ ...chat, business });
  }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chat = await prisma.chat.findUnique({
        where: { id: input.chatId },
        include: {
          participants: true,
          adspaces: {
            include: {
              business: true,
            },
          },
        },
      });

      if (!chat) {
        throw new Error('Chat nie został znaleziony');
      }

      const isParticipant = chat.participants.some((p) => p.id === ctx.user.id);
      if (!isParticipant) {
        throw new Error('Nie masz dostępu do tego czatu');
      }

      const message = await prisma.message.create({
        data: {
          chatId: input.chatId,
          senderId: ctx.user.id,
          content: input.content,
          isRead: false,
        },
      });

      const adspace = chat.adspaces[0];

      if (adspace) {
        const autoResponse = findMatchingResponse(input.content, {
          ...adspace,
          pricePerWeek: adspace.pricePerWeek ?? undefined,
        });
        if (autoResponse) {
          const chatOwner = chat.participants.find((p) => p.id !== ctx.user.id);
          if (chatOwner) {
            setTimeout(async () => {
              await prisma.message.create({
                data: {
                  chatId: input.chatId,
                  senderId: chatOwner.id,
                  content: autoResponse,
                  isRead: false,
                },
              });
            }, 1000);
          }
        }
      }

      return {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        timestamp: message.timestamp,
        isRead: message.isRead,
        senderName: `${ctx.user.firstName} ${ctx.user.lastName}`,
      };
    }),
});
