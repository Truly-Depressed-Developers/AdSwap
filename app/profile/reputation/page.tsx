import { PageHeader } from "@/components/PageHeader";

export default function ReputationPage() {
  return (
    <div className="flex min-h-full flex-col bg-background p-4 pt-0">
      <PageHeader title="Reputacja" />
      
      <main className="flex-1 p-4">
        <p className="text-center text-muted-foreground">Tutaj będzie widoczna Twoja reputacja.</p>
      </main>
    </div>
  );
}
