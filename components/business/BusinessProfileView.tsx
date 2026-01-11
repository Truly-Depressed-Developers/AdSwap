'use client';

import { useRouter } from 'next/navigation';
import { ChatCircleTextIcon, StarIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { AdspaceCard } from '@/components/map/AdspaceCard';
import { ReviewCard } from '@/components/business/ReviewCard';
import { trpc } from '@/trpc/client';
import type { BusinessDetailDTO } from '@/types/dtos/business';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeaderWithBack } from '@/components/FormHeader';

type BusinessProfileViewProps = {
  business: BusinessDetailDTO;
  isOwner?: boolean;
};

export function BusinessProfileView({ business, isOwner = false }: BusinessProfileViewProps) {
  const router = useRouter();
  const createChat = trpc.chat.getOrCreate.useMutation({
    onSuccess: (data) => {
      console.log('Chat created/found:', data);
      router.push(`/chats/${data.id}`);
    },
    onError: (error) => {
      console.error('Failed to create chat:', error);
    },
  });

  const offers = business.adspaces.map((adspace) => ({
    id: adspace.id,
    name: adspace.name,
    imageUrl: adspace.imageUrl,
    pricePerWeek: adspace.pricePerWeek,
    isBarterAvailable: adspace.isBarterAvailable,
    businessName: business.name,
  }));

  const ratingCount = business.ratings.length;
  const averageRating = business.averageRating?.toFixed(1) || 'Brak ocen';

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <PageHeaderWithBack title="Profil Biznesu" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-12 border">
                <AvatarImage src={business.logoUrl} alt={business.name} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {business.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{business.name}</h2>
                <div className="flex items-center gap-1 text-sm">
                  <StarIcon size={16} className="text-yellow-400" weight="fill" />
                  <span className="text-muted-foreground font-medium">{averageRating}</span>
                  <span className="text-muted-foreground">({ratingCount} opinii)</span>
                </div>
              </div>
            </div>

            {!isOwner && (
              <Button
                size="icon"
                className="rounded-full size-12 bg-primary hover:bg-primary/80 text-white"
                onClick={() => createChat.mutate({ businessId: business.id })}
                disabled={createChat.isPending}
              >
                <ChatCircleTextIcon size={28} weight="fill" />
              </Button>
            )}

            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/profile/edit-business')}
              >
                Edytuj
              </Button>
            )}
          </div>

          <Tabs defaultValue="offers" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="offers">Oferty</TabsTrigger>
              <TabsTrigger value="reviews">Opinie</TabsTrigger>
            </TabsList>

            <TabsContent value="offers" className="mt-6 space-y-4">
              {offers.length > 0 ? (
                offers.map((offer) => <AdspaceCard key={offer.id} {...offer} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Brak aktywnych ofert.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-4">
              {business.ratings.length > 0 ? (
                business.ratings.map((rating) => <ReviewCard key={rating.id} rating={rating} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Brak opinii do wyświetlenia.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
