import { Calendar } from "@/app/components/Calendar";
import { teams } from "@/app/types/team";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return teams.map((team) => ({
    teamId: team.id,
  }));
}

export default function TeamCalendarPage({
  params,
}: {
  params: { teamId: string };
}) {
  const team = teams.find((t) => t.id === params.teamId);

  if (!team) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-1">
      <div className="container mx-auto py-2 md:py-4">
        <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
          <Link
            href="/"
            className="flex items-center text-xs md:text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Back to Teams
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{team.name}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{team.description}</p>
          </div>
        </div>
        <Calendar teamId={team.id} />
      </div>
    </main>
  );
}