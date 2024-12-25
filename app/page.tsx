import { TeamGrid } from "./components/TeamGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-1">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Team Schedule Management</h1>
        <p className="text-muted-foreground mb-8">Select a team to view their schedule</p>
        <TeamGrid />
      </div>
    </main>
  );
}