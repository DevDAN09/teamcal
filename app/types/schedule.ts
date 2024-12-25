export interface TaskBlock {
  id: string;
  teamId: string;
  userName: string;
  description: string;
  startDate: string;
  endDate: string;
  color?: string;
}

export interface TaskFormData {
  userName: string;
  description: string;
  startDate: string;
  endDate: string;
}