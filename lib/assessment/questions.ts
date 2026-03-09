export type ITArea = 
  | 'Cloud Engineer' | 'DevOps/SRE' | 'Cybersecurity' | 'Data Engineer' | 'AI/ML' 
  | 'Frontend' | 'Backend' | 'Fullstack' | 'Mobile' | 'UX/UI Designer' 
  | 'QA Automation' | 'SysAdmin' | 'Data Scientist' | 'Solutions Architect' 
  | 'Technical PM' | 'Blockchain' | 'Embedded/IoT' | 'IT Compliance' 
  | 'Salesforce Dev' | 'Security Engineer';

export interface Option {
  label: string;
  weights: Partial<Record<ITArea, number>>;
}

export interface Question {
  id: number;
  text: string;
  category: 'Cognitive' | 'Problem Solving' | 'Collaboration' | 'Interest' | 'Environment';
  options: Option[];
}

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Problem Solving',
    text: "When a new, complex software update is released, how do you typically approach it?",
    options: [
      { label: "Read the full release notes and changelog first.", weights: { 'Cybersecurity': 10, 'IT Compliance': 10, 'QA Automation': 5 } },
      { label: "Install it immediately and explore by trial and error.", weights: { 'Frontend': 5, 'Fullstack': 5, 'Mobile': 10 } },
      { label: "Wait for others to report bugs before updating my system.", weights: { 'SysAdmin': 10, 'Solutions Architect': 5, 'Salesforce Dev': 5 } }
    ]
  },
  {
    id: 2,
    category: 'Collaboration',
    text: "What part of a collaborative project gives you the most satisfaction?",
    options: [
      { label: "Building the underlying logic and data structures.", weights: { 'Backend': 10, 'Data Engineer': 10, 'Blockchain': 10 } },
      { label: "Creating the visual style and user interaction flow.", weights: { 'UX/UI Designer': 10, 'Frontend': 10, 'Mobile': 5 } },
      { label: "Managing the timeline and removing blockers for the team.", weights: { 'Technical PM': 10, 'Solutions Architect': 5, 'DevOps/SRE': 5 } }
    ]
  },
  {
    id: 3,
    category: 'Cognitive',
    text: "How do you naturally handle repetitive tasks like renaming 50 files?",
    options: [
      { label: "Write a small script or use a command-line tool.", weights: { 'DevOps/SRE': 10, 'Cloud Engineer': 10, 'SysAdmin': 10 } },
      { label: "Find a specialized app with a good interface to do it.", weights: { 'UX/UI Designer': 5, 'Technical PM': 5, 'Salesforce Dev': 5 } },
      { label: "Do it manually to ensure 100% accuracy for each one.", weights: { 'IT Compliance': 10, 'Security Engineer': 5 } }
    ]
  }
];
