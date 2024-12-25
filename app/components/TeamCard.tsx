"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Team } from "../types/team";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const router = useRouter();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/team/${team.id}`)}
    >
      <CardHeader>
        <CardTitle>{team.name}</CardTitle>
        <CardDescription>{team.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}