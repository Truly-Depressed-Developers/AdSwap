'use client';

import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

type MatchDialogProps = {
  open: boolean;
  onClose: () => void;
  matchedBusinessName: string;
  chatId: string;
};

export function MatchDialog({ open, onClose, matchedBusinessName, chatId }: MatchDialogProps) {
  const router = useRouter();

  const handleGoToChat = () => {
    router.push(`/chats/${chatId}`);
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl">To dopasowanie!</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Polaczyles sie z <strong>{matchedBusinessName}</strong>! Mozesz teraz rozpoczac rozmowe
            o wspolpracy reklamowej.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogAction onClick={handleGoToChat} className="w-full">
            Przejdz do czatu
          </AlertDialogAction>
          <AlertDialogCancel onClick={onClose} className="w-full">
            Kontynuuj przegladanie
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
