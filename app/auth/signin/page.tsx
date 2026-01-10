import { SignInForm } from '@/app/auth/signin/SignInForm';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}
