import React from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">PromptArmor</h1>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
