'use client';

import { trpc } from '@/trpc/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { format, isToday, isYesterday } from 'date-fns';
import { ChatDTO } from '@/types/dtos';
import { PageHeader } from '@/components/PageHeader';

function formatMessageTime(date: Date) {
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  if (isYesterday(date)) {
    return 'Wczoraj';
  }
  return format(date, 'dd.MM');
}

function ChatItem({ chat }: { chat: ChatDTO }) {
  const lastMessage = chat.lastMessage;
  const business = chat.businessContext;

  const displayName = business?.name || 'Nieznany';
  const displayAvatar = business?.logoUrl;

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/chats/${chat.id}`}
      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b last:border-0"
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={displayAvatar || undefined} alt={displayName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-medium text-[16px] truncate pr-2 text-foreground">{displayName}</h3>
          {lastMessage && (
            <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
              {formatMessageTime(new Date(lastMessage.timestamp))}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground truncate pr-4">
            {lastMessage ? (
              <span className={chat.unreadCount > 0 ? 'font-semibold text-foreground' : ''}>
                {lastMessage.content}
              </span>
            ) : (
              'Brak wiadomości'
            )}
          </p>
          {chat.unreadCount > 0 && (
            <div className="h-2.5 w-2.5 bg-blue-500 rounded-full shrink-0" />
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ChatsPage() {
  const { data: chats, isPending, isError } = trpc.chat.list.useQuery();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">Nie udało się załadować czatów.</div>;
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <PageHeader title="Czaty" />

      <main className="flex-1">
        {chats.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Brak czatów</div>
        ) : (
          <div className="divide-y">
            {chats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

