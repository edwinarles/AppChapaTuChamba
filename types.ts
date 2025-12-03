
export type Role = 'student' | 'admin' | null;

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  salary: string;
  type: string;
  location: string;
  logo: string;
  tags: string[];
  isNew?: boolean;
  url?: string; // Added for external links
  description?: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export type ScraperSource = {
  id: string;
  name: string;
  active: boolean;
  lastRun: string;
  icon: string;
};

export type SystemLog = {
  id: string;
  status: 'active' | 'error';
  message: string;
  timestamp: string;
};

export interface UserPreferences {
  sectorGeneral: string;
  sectorSub: string;
  locationDept: string;
  locationDist: string;
  experience: string;
  salary: number;
  schedule: string;
  modality: string;
  career: string;
  skills: string[];
}

export type NotificationPlatform = 'whatsapp' | 'email' | 'telegram';

export interface AgentPlan {
  agentName: string;
  searchFrequency: string;
  optimizedQueries: string[];
  estimatedMatchesPerWeek: number;
}
