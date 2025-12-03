import { Job, Notification, ScraperSource, SystemLog, User } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'UX/UI Designer Intern',
    company: 'TechFlow Inc.',
    salary: 'S/1.2K/Mo',
    type: 'Part-time',
    location: 'Remoto',
    logo: 'https://picsum.photos/id/1/50/50',
    tags: ['Remote', 'Design', 'Figma'],
  },
  {
    id: '2',
    title: 'Frontend Developer Trainee',
    company: 'Innovate Peru',
    salary: 'S/1.5K/Mo',
    type: 'Full-time',
    location: 'Lima',
    logo: 'https://picsum.photos/id/2/50/50',
    tags: ['React', 'Tailwind', 'Hybrid'],
  },
  {
    id: '3',
    title: 'Marketing Digital Assistant',
    company: 'Creative Studio',
    salary: 'S/1.0K/Mo',
    type: 'Practicas',
    location: 'Arequipa',
    logo: 'https://picsum.photos/id/3/50/50',
    tags: ['Social Media', 'Ads'],
  },
  {
    id: '4',
    title: 'Backend Developer Intern',
    company: 'BankSecure',
    salary: 'S/1.8K/Mo',
    type: 'Full-time',
    location: 'Lima',
    logo: 'https://picsum.photos/id/4/50/50',
    tags: ['Node.js', 'Security', 'On-site'],
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Entrevista Agendada',
    message: 'TechFlow ha visto tu perfil y quiere conversar contigo.',
    time: 'Hace 2h',
    read: false,
  },
  {
    id: '2',
    title: 'Nueva oferta similar',
    message: 'Se ha publicado una oferta que coincide con tus alertas.',
    time: 'Hace 5h',
    read: true,
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Juan Perez',
    email: 'juan.perez@student.edu',
    role: 'student',
    avatar: 'https://picsum.photos/id/64/100/100',
  },
  {
    id: 'u2',
    name: 'Maria Lopez',
    email: 'maria.lopez@student.edu',
    role: 'student',
    avatar: 'https://picsum.photos/id/65/100/100',
  },
  {
    id: 'u3',
    name: 'Carlos Admin',
    email: 'admin@chapatuchamba.com',
    role: 'admin',
    avatar: 'https://picsum.photos/id/66/100/100',
  },
];

export const MOCK_SOURCES: ScraperSource[] = [
  { id: 's1', name: 'LinkedIn Jobs', active: true, lastRun: '10 mins ago', icon: 'L' },
  { id: 's2', name: 'Computrabajo', active: false, lastRun: '1 day ago', icon: 'C' },
  { id: 's3', name: 'Bumeran', active: true, lastRun: '2 hours ago', icon: 'B' },
];

export const MOCK_LOGS: SystemLog[] = [
  { id: 'l1', status: 'active', message: 'Scraper LinkedIn finished successfully.', timestamp: '10:00 AM' },
  { id: 'l2', status: 'error', message: 'Connection timeout on Computrabajo.', timestamp: '09:45 AM' },
  { id: 'l3', status: 'active', message: 'User database backup completed.', timestamp: '09:00 AM' },
];