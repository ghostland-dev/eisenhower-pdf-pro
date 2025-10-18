export type QuadrantType = 
  | "urgent-important" 
  | "important" 
  | "urgent" 
  | "neither";

export interface Task {
  id: string;
  text: string;
  quadrant: QuadrantType;
  createdAt: Date;
}

export interface QuadrantConfig {
  id: QuadrantType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
