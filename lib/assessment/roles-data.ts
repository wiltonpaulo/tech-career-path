export interface CareerRole {
  id: string;
  title: string;
  salary: string;
  demand: 'Extreme' | 'High' | 'Very High';
  description: string;
  skills: string[];
  hubs: string[];
}

export const MARKET_ROLES: CareerRole[] = [
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    salary: '$125k - $185k',
    demand: 'Extreme',
    description: 'Specializes in designing, deploying, and managing scalable cloud infrastructure on AWS, Azure, or GCP.',
    skills: ['AWS/Azure', 'Terraform', 'Kubernetes'],
    hubs: ['Austin, TX', 'Seattle, WA', 'Ashburn, VA']
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    salary: '$110k - $170k',
    demand: 'Extreme',
    description: 'Protects US critical infrastructure and corporate assets from sophisticated cyber threats and data breaches.',
    skills: ['SIEM', 'Penetration Testing', 'SOC'],
    hubs: ['Washington, D.C.', 'Atlanta, GA', 'San Antonio, TX']
  },
  {
    id: 'devops-sre',
    title: 'DevOps / SRE',
    salary: '$130k - $195k',
    demand: 'Extreme',
    description: 'Bridges the gap between development and operations through massive automation and system reliability engineering.',
    skills: ['CI/CD', 'Python/Go', 'Prometheus'],
    hubs: ['San Francisco, CA', 'New York, NY', 'Austin, TX']
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    salary: '$120k - $180k',
    demand: 'Very High',
    description: 'Architects the pipelines that move and transform massive amounts of data for real-time decision making.',
    skills: ['Spark', 'SQL', 'Airflow'],
    hubs: ['Denver, CO', 'Chicago, IL', 'San Francisco, CA']
  },
  {
    id: 'ai-ml-specialist',
    title: 'AI / ML Specialist',
    salary: '$145k - $250k',
    demand: 'Extreme',
    description: 'Develops generative models and predictive algorithms that drive the current US innovation landscape.',
    skills: ['PyTorch', 'Large Language Models', 'Math'],
    hubs: ['San Jose, CA', 'Boston, MA', 'Austin, TX']
  },
  {
    id: 'solutions-architect',
    title: 'Solutions Architect',
    salary: '$140k - $210k',
    demand: 'High',
    description: 'Designs complex technical ecosystems that solve specific business problems using cloud-native patterns.',
    skills: ['System Design', 'Governance', 'Enterprise Architecture'],
    hubs: ['Charlotte, NC', 'Dallas, TX', 'Phoenix, AZ']
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    salary: '$105k - $165k',
    demand: 'Very High',
    description: 'Creates highly responsive and accessible digital interfaces using modern frameworks like React and Next.js.',
    skills: ['React', 'TypeScript', 'Accessibility'],
    hubs: ['Miami, FL', 'New York, NY', 'Los Angeles, CA']
  },
  {
    id: 'ux-ui-designer',
    title: 'Product Designer (UX/UI)',
    salary: '$100k - $160k',
    demand: 'High',
    description: 'Researches and designs the human-centric experiences that define how Americans interact with technology.',
    skills: ['Figma', 'User Research', 'Design Systems'],
    hubs: ['New York, NY', 'San Francisco, CA', 'Austin, TX']
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    salary: '$115k - $175k',
    demand: 'Very High',
    description: 'Builds the secure and high-performance server-side logic that powers modern applications.',
    skills: ['Node.js/Go', 'Distributed Systems', 'NoSQL'],
    hubs: ['Salt Lake City, UT', 'Raleigh, NC', 'Seattle, WA']
  },
  {
    id: 'qa-automation',
    title: 'QA / Automation Engineer',
    salary: '$95k - $150k',
    demand: 'High',
    description: 'Ensures software quality through the development of automated testing frameworks and continuous verification.',
    skills: ['Playwright', 'Selenium', 'Chaos Engineering'],
    hubs: ['Columbus, OH', 'Tampa, FL', 'Portland, OR']
  },
  {
    id: 'mobile-developer',
    title: 'Mobile Developer',
    salary: '$110k - $170k',
    demand: 'Very High',
    description: 'Specializes in high-performance native and cross-platform applications for iOS and Android.',
    skills: ['Swift/Kotlin', 'React Native', 'Mobile Security'],
    hubs: ['Los Angeles, CA', 'Miami, FL', 'Austin, TX']
  },
  {
    id: 'fullstack-engineer',
    title: 'Fullstack Engineer',
    salary: '$120k - $180k',
    demand: 'Extreme',
    description: 'Versatile engineers capable of handling everything from database architecture to complex frontend interactions.',
    skills: ['Next.js', 'PostgreSQL', 'Cloud Native'],
    hubs: ['Remote', 'Denver, CO', 'New York, NY']
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    salary: '$130k - $200k',
    demand: 'Very High',
    description: 'Applies advanced statistical modeling and machine learning to solve complex business and societal challenges.',
    skills: ['Python/R', 'TensorFlow', 'Pandas'],
    hubs: ['San Francisco, CA', 'Boston, MA', 'Chicago, IL']
  },
  {
    id: 'sysadmin',
    title: 'Systems Administrator',
    salary: '$90k - $145k',
    demand: 'High',
    description: 'Manages the core operating systems and local infrastructure that keep businesses running smoothly.',
    skills: ['Linux/Unix', 'Networking', 'Active Directory'],
    hubs: ['Across USA', 'Minneapolis, MN', 'Phoenix, AZ']
  },
  {
    id: 'technical-pm',
    title: 'Technical Product Manager',
    salary: '$135k - $210k',
    demand: 'Very High',
    description: 'Defines the product vision and bridges communication between engineering teams and business stakeholders.',
    skills: ['Agile', 'Product Strategy', 'Technical Writing'],
    hubs: ['Seattle, WA', 'San Jose, CA', 'New York, NY']
  },
  {
    id: 'blockchain-dev',
    title: 'Blockchain Developer',
    salary: '$140k - $230k',
    demand: 'High',
    description: 'Designs secure decentralized systems and smart contracts for the next generation of financial infrastructure.',
    skills: ['Solidity', 'Cryptography', 'Rust'],
    hubs: ['Miami, FL', 'San Francisco, CA', 'Remote']
  },
  {
    id: 'embedded-iot',
    title: 'Embedded / IoT Engineer',
    salary: '$115k - $180k',
    demand: 'High',
    description: 'Writes low-level code for the hardware devices that power the smart cities and medical tech of tomorrow.',
    skills: ['C/C++', 'RTOS', 'Firmware Security'],
    hubs: ['Huntsville, AL', 'Boulder, CO', 'San Diego, CA']
  },
  {
    id: 'it-compliance',
    title: 'IT Compliance & Audit',
    salary: '$100k - $160k',
    demand: 'Very High',
    description: 'Ensures that technical systems meet US federal and state regulations like SOC2, HIPAA, and GDPR.',
    skills: ['Risk Assessment', 'ISO 27001', 'Governance'],
    hubs: ['Charlotte, NC', 'Washington, D.C.', 'Atlanta, GA']
  },
  {
    id: 'salesforce-dev',
    title: 'Salesforce / CRM Developer',
    salary: '$110k - $175k',
    demand: 'High',
    description: 'Customizes and scales the CRM platforms that drive the sales and operations of major US corporations.',
    skills: ['Apex', 'LWC', 'Integrations'],
    hubs: ['Indianapolis, IN', 'Dallas, TX', 'Chicago, IL']
  },
  {
    id: 'security-engineer',
    title: 'Security Engineer',
    salary: '$135k - $200k',
    demand: 'Extreme',
    description: 'Architects and builds the defensive systems that secure cloud networks and application data at scale.',
    skills: ['Cloud Security', 'IAM', 'Encryption'],
    hubs: ['Arlington, VA', 'San Jose, CA', 'Austin, TX']
  }
];
