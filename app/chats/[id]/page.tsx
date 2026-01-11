'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { trpc } from '@/trpc/client';
import { ArrowLeftIcon, PaperPlaneRightIcon } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id as string;
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chat, isLoading, refetch } = trpc.chat.getById.useQuery(
    { id },
    {
      refetchInterval: 2000,
      refetchIntervalInBackground: false,
    }
  );
  
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      refetch();
      setMessage('');
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSend = () => {
    if (!message.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate({
      chatId: id,
      content: message.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <span className="text-muted-foreground">Ładowanie...</span>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg font-medium">Nie znaleziono czatu</p>
      </div>
    );
  }

  const otherParticipant = chat.participants.find((p) => p.id !== session?.user?.id);
  const adspace = chat.connectedAdspaces[0];

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="shrink-0 border-b bg-background px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-lg font-medium">{chat.businessContext.name}</h1>
      </div>

      {adspace && (
        <Link href={`/offers/${adspace.id}`} className="shrink-0 border-b bg-card hover:bg-muted/50 transition-colors">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={adspace.imageUrl}
                  alt={adspace.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{adspace.name}</p>
                <p className="text-sm text-muted-foreground">{chat.businessContext.address}</p>
              </div>
              {adspace.pricePerWeek && (
                <div className="shrink-0 font-medium">{adspace.pricePerWeek}zł / tyg</div>
              )}
            </div>
          </div>
        </Link>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-3">
          {chat.messages.map((msg) => {
            const isOwn = msg.senderId === session?.user?.id;
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    <p className="text-base leading-relaxed">{msg.content}</p>
                  </div>
                  <span
                    className={`text-xs text-muted-foreground ${isOwn ? 'text-right' : 'text-left'}`}
                  >
                    {format(new Date(msg.timestamp), 'HH:mm', { locale: pl })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 border-t bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Wpisz wiadomość"
            className="flex-1 rounded-full border bg-background px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PaperPlaneRightIcon size={20} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}