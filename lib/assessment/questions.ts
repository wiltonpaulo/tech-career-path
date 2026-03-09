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
  },
  {
    id: 4,
    category: 'Interest',
    text: "Which of these technological 'mysteries' interests you more?",
    options: [
      { label: "How to prevent a sophisticated global cyber-attack.", weights: { 'Cybersecurity': 10, 'Security Engineer': 10, 'Embedded/IoT': 5 } },
      { label: "How to make an AI understand human emotions.", weights: { 'AI/ML': 10, 'Data Scientist': 10, 'Data Engineer': 5 } },
      { label: "How to handle millions of simultaneous users on a website.", weights: { 'Cloud Engineer': 10, 'DevOps/SRE': 10, 'Fullstack': 5 } }
    ]
  },
  {
    id: 5,
    category: 'Environment',
    text: "In your ideal workspace, what is the 'gold standard' of success?",
    options: [
      { label: "The system never goes down and is perfectly secure.", weights: { 'SysAdmin': 10, 'DevOps/SRE': 10, 'Cybersecurity': 10 } },
      { label: "Users are delighted by how beautiful and easy the app is.", weights: { 'UX/UI Designer': 10, 'Frontend': 10, 'Mobile': 5 } },
      { label: "We extracted valuable insights from messy data.", weights: { 'Data Scientist': 10, 'Data Engineer': 10, 'AI/ML': 10 } }
    ]
  },
  {
    id: 6,
    category: 'Problem Solving',
    text: "If you find a bug in a system you are using, you usually:",
    options: [
      { label: "Try to find exactly which line of code or setting caused it.", weights: { 'QA Automation': 10, 'Backend': 10, 'Security Engineer': 5 } },
      { label: "Report it with clear screenshots and move on.", weights: { 'Technical PM': 10, 'UX/UI Designer': 5, 'Salesforce Dev': 5 } },
      { label: "Search for a workaround so I can keep working.", weights: { 'Fullstack': 5, 'Frontend': 5, 'Cloud Engineer': 5 } }
    ]
  },
  {
    id: 7,
    category: 'Cognitive',
    text: "When learning something new, you prefer:",
    options: [
      { label: "A highly structured course with a clear path.", weights: { 'IT Compliance': 10, 'Salesforce Dev': 10, 'SysAdmin': 5 } },
      { label: "Building a real project and learning as I go.", weights: { 'Fullstack': 10, 'Mobile': 10, 'AI/ML': 5 } },
      { label: "Reading the underlying theory and mathematical principles.", weights: { 'Data Scientist': 10, 'Blockchain': 10, 'Solutions Architect': 5 } }
    ]
  },
  {
    id: 8,
    category: 'Collaboration',
    text: "During a technical discussion, you are the one who:",
    options: [
      { label: "Points out the potential security risks and edge cases.", weights: { 'Cybersecurity': 10, 'Security Engineer': 10, 'QA Automation': 5 } },
      { label: "Suggests how to make the feature more scalable in the cloud.", weights: { 'Cloud Engineer': 10, 'Solutions Architect': 10, 'DevOps/SRE': 5 } },
      { label: "Focuses on how the end-user will experience the change.", weights: { 'UX/UI Designer': 10, 'Frontend': 10, 'Technical PM': 5 } }
    ]
  },
  {
    id: 9,
    category: 'Environment',
    text: "How do you feel about working with 'Invisible' systems (no UI)?",
    options: [
      { label: "I love it; the logic and efficiency are what matters.", weights: { 'Backend': 10, 'Embedded/IoT': 10, 'Blockchain': 10 } },
      { label: "I can do it, but I prefer seeing a visual result of my work.", weights: { 'Fullstack': 10, 'Mobile': 5, 'Salesforce Dev': 5 } },
      { label: "I find it boring; I need to see the interface to feel productive.", weights: { 'Frontend': 10, 'UX/UI Designer': 10 } }
    ]
  },
  {
    id: 10,
    category: 'Cognitive',
    text: "What is your relationship with mathematics and logic puzzles?",
    options: [
      { label: "I enjoy them and find patterns easily.", weights: { 'Data Scientist': 10, 'AI/ML': 10, 'Blockchain': 10 } },
      { label: "I see them as a necessary tool to solve real-world problems.", weights: { 'Data Engineer': 10, 'Backend': 10, 'Solutions Architect': 5 } },
      { label: "I prefer to focus on creative and human-centric challenges.", weights: { 'UX/UI Designer': 10, 'Technical PM': 10, 'Frontend': 5 } }
    ]
  },
  {
    id: 11,
    category: 'Problem Solving',
    text: "If you had to choose a superpower for your career, it would be:",
    options: [
      { label: "The ability to see through any encryption or lock.", weights: { 'Cybersecurity': 15, 'Security Engineer': 10 } },
      { label: "The ability to automate any task just by thinking about it.", weights: { 'DevOps/SRE': 15, 'QA Automation': 10, 'Cloud Engineer': 5 } },
      { label: "The ability to predict market trends with 100% accuracy.", weights: { 'Data Scientist': 15, 'Technical PM': 10, 'AI/ML': 5 } }
    ]
  },
  {
    id: 12,
    category: 'Interest',
    text: "Which of these devices fascinates you more?",
    options: [
      { label: "A self-driving car's sensor and control system.", weights: { 'Embedded/IoT': 15, 'AI/ML': 10, 'C-Level/PM': 2 } },
      { label: "The infrastructure that powers a global social network.", weights: { 'Cloud Engineer': 15, 'Solutions Architect': 10, 'SysAdmin': 5 } },
      { label: "A cryptocurrency's decentralized ledger system.", weights: { 'Blockchain': 15, 'Backend': 10, 'Data Engineer': 5 } }
    ]
  },
  {
    id: 13,
    category: 'Environment',
    text: "How do you prefer to handle high-pressure deadlines?",
    options: [
      { label: "Strictly following a pre-defined plan and checklist.", weights: { 'IT Compliance': 10, 'SysAdmin': 10, 'Salesforce Dev': 5 } },
      { label: "Improvising and finding creative 'hacks' to get it done.", weights: { 'Fullstack': 10, 'Frontend': 10, 'Mobile': 5 } },
      { label: "Analyzing the bottleneck and optimizing the workflow.", weights: { 'DevOps/SRE': 10, 'Data Engineer': 10, 'Technical PM': 5 } }
    ]
  },
  {
    id: 14,
    category: 'Cognitive',
    text: "When you see a messy spreadsheet, you feel:",
    options: [
      { label: "An urge to clean the data and find the correlations.", weights: { 'Data Engineer': 10, 'Data Scientist': 10, 'AI/ML': 5 } },
      { label: "A need to hide it behind a clean dashboard or UI.", weights: { 'UX/UI Designer': 10, 'Frontend': 10, 'Technical PM': 5 } },
      { label: "Indifferent, as long as the numbers are technically correct.", weights: { 'Backend': 10, 'SysAdmin': 5 } }
    ]
  },
  {
    id: 15,
    category: 'Collaboration',
    text: "If a teammate makes a mistake, your first thought is:",
    options: [
      { label: "How can we create a test to prevent this from ever happening again?", weights: { 'QA Automation': 10, 'DevOps/SRE': 10, 'Security Engineer': 5 } },
      { label: "How can I help them fix it and understand the logic?", weights: { 'Solutions Architect': 10, 'Technical PM': 10, 'Fullstack': 5 } },
      { label: "Does this mistake expose a security vulnerability?", weights: { 'Cybersecurity': 10, 'Security Engineer': 10, 'IT Compliance': 5 } }
    ]
  },
  {
    id: 16,
    category: 'Problem Solving',
    text: "You prefer a challenge that is:",
    options: [
      { label: "Well-defined with a clear 'right' answer.", weights: { 'Backend': 10, 'IT Compliance': 10, 'QA Automation': 10 } },
      { label: "Open-ended with many possible creative solutions.", weights: { 'UX/UI Designer': 10, 'Frontend': 10, 'AI/ML': 10 } },
      { label: "Complex and requires connecting many different systems.", weights: { 'Solutions Architect': 10, 'Cloud Engineer': 10, 'Fullstack': 10 } }
    ]
  },
  {
    id: 17,
    category: 'Cognitive',
    text: "What is your 'native language' of thinking?",
    options: [
      { label: "Step-by-step logical instructions (Algorithm).", weights: { 'Backend': 10, 'Data Engineer': 10, 'Blockchain': 10 } },
      { label: "Visual patterns and spatial relationships (Design).", weights: { 'UX/UI Designer': 10, 'Frontend': 10, 'Mobile': 10 } },
      { label: "Statistical probabilities and trends (Data).", weights: { 'Data Scientist': 10, 'AI/ML': 10, 'Technical PM': 5 } }
    ]
  },
  {
    id: 18,
    category: 'Interest',
    text: "Which of these 'Digital Roles' sounds most like a hero to you?",
    options: [
      { label: "The Architect: Planning the foundations of a city.", weights: { 'Solutions Architect': 10, 'Cloud Engineer': 10, 'Data Engineer': 10 } },
      { label: "The Guardian: Protecting the city from invaders.", weights: { 'Cybersecurity': 10, 'Security Engineer': 10, 'IT Compliance': 10 } },
      { label: "The Artist: Making the city beautiful and usable.", weights: { 'UX/UI Designer': 10, 'Frontend': 10, 'Mobile': 10 } }
    ]
  },
  {
    id: 19,
    category: 'Environment',
    text: "How much 'chaos' can you handle in your daily work?",
    options: [
      { label: "None. I need a predictable and stable environment.", weights: { 'IT Compliance': 10, 'SysAdmin': 10, 'QA Automation': 5 } },
      { label: "A moderate amount. I like new challenges every week.", weights: { 'Fullstack': 10, 'Mobile': 10, 'Salesforce Dev': 10 } },
      { label: "Bring it on. I thrive in high-stakes, rapidly changing situations.", weights: { 'DevOps/SRE': 10, 'Cybersecurity': 10, 'Cloud Engineer': 10 } }
    ]
  },
  {
    id: 20,
    category: 'Collaboration',
    text: "When you disagree with a technical decision, you:",
    options: [
      { label: "Present data and benchmarks to prove your point.", weights: { 'Data Scientist': 10, 'Data Engineer': 10, 'Backend': 5 } },
      { label: "Argue based on industry standards and security best practices.", weights: { 'Security Engineer': 10, 'IT Compliance': 10, 'Cybersecurity': 5 } },
      { label: "Suggest a compromise that balances user needs and dev time.", weights: { 'Technical PM': 10, 'UX/UI Designer': 10, 'Solutions Architect': 5 } }
    ]
  },
  {
    id: 21,
    category: 'Cognitive',
    text: "How do you feel about reading 500 lines of other people's code?",
    options: [
      { label: "I enjoy finding the logic and potential optimizations.", weights: { 'Backend': 10, 'QA Automation': 10, 'Security Engineer': 5 } },
      { label: "I find it exhausting; I'd rather build something from scratch.", weights: { 'Frontend': 5, 'Mobile': 5, 'Fullstack': 5 } },
      { label: "I look for potential security flaws and data leaks.", weights: { 'Cybersecurity': 10, 'Security Engineer': 10, 'IT Compliance': 10 } }
    ]
  },
  {
    id: 22,
    category: 'Problem Solving',
    text: "If you could only use one tool forever, it would be:",
    options: [
      { label: "The Command Line (Terminal).", weights: { 'SysAdmin': 10, 'DevOps/SRE': 10, 'Backend': 10 } },
      { label: "A visual Design tool (Figma/Adobe).", weights: { 'UX/UI Designer': 10, 'Frontend': 5 } },
      { label: "A data notebook (Jupyter/Excel).", weights: { 'Data Scientist': 10, 'AI/ML': 10, 'Data Engineer': 10 } }
    ]
  },
  {
    id: 23,
    category: 'Interest',
    text: "What part of the Internet is more fascinating?",
    options: [
      { label: "The physical cables and global routing protocols.", weights: { 'Cloud Engineer': 10, 'SysAdmin': 10, 'Embedded/IoT': 10 } },
      { label: "The algorithms that decide what you see next.", weights: { 'AI/ML': 10, 'Data Scientist': 10, 'Backend': 5 } },
      { label: "The way it has changed how humans socialize.", weights: { 'UX/UI Designer': 10, 'Technical PM': 10, 'Mobile': 5 } }
    ]
  },
  {
    id: 24,
    category: 'Environment',
    text: "You are more comfortable being:",
    options: [
      { label: "The person who knows every single detail of one system.", weights: { 'SysAdmin': 10, 'Blockchain': 10, 'Salesforce Dev': 10 } },
      { label: "The person who understands how all systems fit together.", weights: { 'Solutions Architect': 10, 'Cloud Engineer': 10, 'Technical PM': 10 } },
      { label: "The person who can build anything from a simple idea.", weights: { 'Fullstack': 10, 'Mobile': 10, 'Frontend': 10 } }
    ]
  },
  {
    id: 25,
    category: 'Collaboration',
    text: "Your favorite type of meeting is:",
    options: [
      { label: "A technical brainstorming session on a whiteboard.", weights: { 'Solutions Architect': 10, 'Backend': 5, 'UX/UI Designer': 5 } },
      { label: "A quick daily sync to stay aligned on goals.", weights: { 'Technical PM': 10, 'Fullstack': 10, 'Mobile': 10 } },
      { label: "No meeting at all; just send me the ticket.", weights: { 'QA Automation': 10, 'Data Engineer': 10, 'Blockchain': 10 } }
    ]
  },
  {
    id: 26,
    category: 'Cognitive',
    text: "When you find a shortcut in a game or process, you:",
    options: [
      { label: "Exploit it to win faster.", weights: { 'Cybersecurity': 10, 'Security Engineer': 10 } },
      { label: "Tell the creators so they can fix it.", weights: { 'QA Automation': 10, 'IT Compliance': 10 } },
      { label: "Think about how the code behind the shortcut works.", weights: { 'Backend': 10, 'DevOps/SRE': 10 } }
    ]
  },
  {
    id: 27,
    category: 'Problem Solving',
    text: "You are more of a:",
    options: [
      { label: "Firefighter: I love fixing urgent problems right now.", weights: { 'SysAdmin': 10, 'DevOps/SRE': 10, 'Cybersecurity': 10 } },
      { label: "Planner: I love building things that won't break later.", weights: { 'Solutions Architect': 10, 'Data Engineer': 10, 'QA Automation': 10 } },
      { label: "Innovator: I love creating things that never existed.", weights: { 'AI/ML': 10, 'UX/UI Designer': 10, 'Blockchain': 10 } }
    ]
  },
  {
    id: 28,
    category: 'Interest',
    text: "Which 'Risk' is more acceptable to you?",
    options: [
      { label: "A system being slightly slow but 100% secure.", weights: { 'Cybersecurity': 10, 'IT Compliance': 10, 'Security Engineer': 10 } },
      { label: "A system being fast and beautiful but having minor bugs.", weights: { 'Frontend': 10, 'Mobile': 10, 'UX/UI Designer': 5 } },
      { label: "A system being complex but highly scalable.", weights: { 'Cloud Engineer': 10, 'Solutions Architect': 10, 'Backend': 5 } }
    ]
  },
  {
    id: 29,
    category: 'Environment',
    text: "You prefer working with:",
    options: [
      { label: "Code that directly moves physical things (Motors, Sensors).", weights: { 'Embedded/IoT': 15, 'SysAdmin': 5 } },
      { label: "Code that manages millions of dollars (Transactions, Ledgers).", weights: { 'Blockchain': 15, 'Backend': 10, 'Salesforce Dev': 5 } },
      { label: "Code that influences millions of people's opinions (Social, AI).", weights: { 'AI/ML': 15, 'Data Scientist': 10, 'UX/UI Designer': 5 } }
    ]
  },
  {
    id: 30,
    category: 'Collaboration',
    text: "In a team, you want to be known as:",
    options: [
      { label: "The person who can solve any technical crisis.", weights: { 'DevOps/SRE': 10, 'SysAdmin': 10, 'Cybersecurity': 10 } },
      { label: "The person who creates the best user experience.", weights: { 'UX/UI Designer': 10, 'Frontend': 10, 'Mobile': 10 } },
      { label: "The person who designs the master plan for the product.", weights: { 'Solutions Architect': 10, 'Technical PM': 10, 'Data Scientist': 10 } }
    ]
  }
];
