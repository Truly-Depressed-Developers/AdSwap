import { PageHeader } from "@/components/PageHeader";

export default function PlanPage() {
  return (
    <div className="flex min-h-full flex-col bg-background p-4 pt-0">
      <PageHeader title="Twój plan" />
      <main className="flex-1 p-4">
        <p className="text-center text-muted-foreground">Tutaj będzie widoczny Twój plan.</p>
      </main>
    </div>
  );
}
