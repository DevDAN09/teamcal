export interface Team {
  id: string;
  name: string;
  description: string;
}

export const teams: Team[] = [
  {
    id: "cogo",
    name: "Team COGO",
    description: "COGO 팀 일정 관리"
  },
  {
    id: "gdg-web",
    name: "Team GDG WEB",
    description: "GDG WEB 팀 일정 관리"
  }
];