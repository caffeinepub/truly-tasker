export type Priority = 'High' | 'Moderate' | 'Low';
export type TaskType = 
  | 'Revision' 
  | 'PYQs' 
  | 'Notes' 
  | 'Sample Paper' 
  | 'Test Prep'
  | 'Concept Building'
  | 'Theory Revision'
  | 'Numerical Practice'
  | 'Case Study Practice'
  | 'Assertion Reason'
  | 'PYQ Intensive'
  | 'Sample Paper Drill'
  | 'Weak Area Fix'
  | 'Rapid Revision'
  | 'Exam Focus'
  | 'Full Syllabus Revision';

export type Subject = 'English' | 'Hindi' | 'Science' | 'Mathematics' | 'Social Science' | 'AI';

export interface PomodoroCompletion {
  timestamp: number; // Unix timestamp in milliseconds
  duration: number; // Duration in minutes
  mode: 'focus' | 'shortBreak' | 'longBreak';
}

export interface Task {
  id: string;
  subject: Subject;
  chapter: string;
  type: TaskType;
  priority: Priority;
  reward: string;
  xp: string;
  done: boolean;
  notes?: string;
  pomodoroCompletions?: PomodoroCompletion[];
}

export interface StudyDay {
  date: string; // ISO string
  tasks: Task[];
  collapsed: boolean;
}

export interface PomodoroSettings {
  focusDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  currentMode: 'focus' | 'shortBreak' | 'longBreak';
  isRunning: boolean;
  remainingSeconds: number;
  selectedTaskId?: string;
}

export interface ThemeSettings {
  mode: 'light' | 'dark';
  accentColor?: string;
  backgroundType: 'default' | 'image' | 'url';
  backgroundImage?: string; // data URL or external URL
}

export interface TaskerState {
  days: StudyDay[];
  pomodoro: PomodoroSettings;
  theme?: ThemeSettings;
  lastVisitDay?: string; // IST date string (YYYY-MM-DD in Asia/Kolkata timezone)
  engagementStreak?: number;
}

export const CHAPTERS: Record<Subject, string[]> = {
  'Science': [
    'Chemical Reactions and Equations',
    'Acids, Bases and Salts',
    'Metals and Non-metals',
    'Carbon and its Compounds',
    'Life Processes',
    'Control and Coordination',
    'How do Organisms Reproduce',
    'Heredity',
    'Light – Reflection and Refraction',
    'The Human Eye and the Colourful World',
    'Electricity',
    'Magnetic Effects of Electric Current',
    'Our Environment'
  ],
  'Mathematics': [
    'Real Numbers',
    'Polynomials',
    'Pair of Linear Equations in Two Variables',
    'Quadratic Equations',
    'Arithmetic Progressions',
    'Triangles',
    'Coordinate Geometry',
    'Introduction to Trigonometry',
    'Some Applications of Trigonometry',
    'Circles',
    'Areas Related to Circles',
    'Surface Areas and Volumes',
    'Statistics',
    'Probability'
  ],
  'English': [
    'F1 – Two Gentlemen of Verona',
    "F2 – Mrs Packeltide's Tiger",
    'F3 – The Letter',
    'F4 – A Shady Plot',
    'F5 – Patol Babu, Film Star',
    'F6 – Virtually True',
    'P1 – The Frog and the Nightingale',
    'P2 – Not Marble, Nor the Gilded Monuments',
    'P3 – Ozymandias',
    'P4 – The Rime of the Ancient Mariner',
    'P5 – Snake',
    'D1 – The Dear Departed',
    'D2 – Julius Caesar',
    'Gap Filling',
    'Omission',
    'Error Correction',
    'Reported Speech',
    'Jumbled Sentences',
    'Letter',
    'Article Writing',
    'Application',
    'Factual Description'
  ],
  'Social Science': [
    'The Rise of Nationalism in Europe',
    'Nationalism in India',
    'The Making of a Global World',
    'The Age of Industrialization',
    'Print Culture and the Modern World',
    'Resources and Development',
    'Forest and Wildlife Resources',
    'Water Resources',
    'Agriculture',
    'Minerals and Energy Resources',
    'Manufacturing Industries',
    'Lifelines of National Economy',
    'Power Sharing',
    'Federalism',
    'Gender, Religion and Caste',
    'Political Parties',
    'Outcomes of Democracy',
    'Development',
    'Sectors of the Indian Economy',
    'Money and Credit',
    'Globalisation and the Indian Economy',
    'Consumer Rights'
  ],
  'AI': [
    'Communication Skills',
    'Self-Management Skills',
    'Information and Communication Technology Skills',
    'Entrepreneurial Skills',
    'Green Skills',
    'Introduction to Artificial Intelligence',
    'AI Project Cycle',
    'Natural Language Processing',
    'Evaluating Models',
    'Data Sciences',
    'Computer Vision'
  ],
  'Hindi': []
};
