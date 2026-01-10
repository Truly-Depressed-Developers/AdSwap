'use client';

import { ComponentExample } from '@/components/component-example';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isSignedIn = status === 'authenticated' && !!session?.user;

  return (
    <div>
      <nav className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bitehack</h1>
          <div className="flex items-center gap-2">
            <Link href="/test-data">
              <Button variant="outline" size="sm">
                Test Data
              </Button>
            </Link>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : isSignedIn ? (
              <>
                <Link href="/my-offers/create-offer">
                  <Button variant="outline" size="sm">
                    Create Offer
                  </Button>
                </Link>
                <span className="text-sm text-muted-foreground">
                  {session.user.firstName} {session.user.lastName}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <h1>Home</h1>
        <ComponentExample />
      </main>
    </div>
  );
}
