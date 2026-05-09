import { StartupIdea } from '../types';

export const startupIdeas: StartupIdea[] = [
  {
    id: 'idea1',
    entrepreneurId: 'e1',
    title: 'AI-Powered Financial Analytics for SMBs',
    summary: 'Helping small businesses make data-driven decisions with real-time AI insights',
    industry: 'FinTech',
    fundingNeeded: '$1.5M',
    stage: 'mvp',
    tags: ['AI', 'Finance', 'SaaS', 'SMB'],
    problem: 'Small businesses lack access to enterprise-grade financial analytics tools. They rely on spreadsheets and gut instinct for critical financial decisions, leading to poor outcomes.',
    solution: 'TechWave AI provides an affordable, easy-to-use platform that connects to existing accounting software and delivers real-time AI-powered insights, forecasting, and anomaly detection.',
    businessModel: 'SaaS subscription at $99/month for small businesses, $299/month for medium businesses. Enterprise plans available.',
    traction: '150 beta users, $45K MRR, 92% retention rate, partnerships with 3 accounting software providers.',
    teamSize: 12,
    location: 'San Francisco, CA',
    createdAt: '2024-01-15T09:24:00Z',
    likes: 47,
    views: 312,
    likedBy: ['i1', 'i2']
  },
  {
    id: 'idea2',
    entrepreneurId: 'e2',
    title: 'Biodegradable Packaging Revolution',
    summary: 'Replacing single-use plastic packaging with 100% biodegradable alternatives at scale',
    industry: 'CleanTech',
    fundingNeeded: '$2M',
    stage: 'early-traction',
    tags: ['Sustainability', 'Packaging', 'B2B', 'CleanTech'],
    problem: 'The global packaging industry produces 141 million tonnes of plastic annually. Only 9% is recycled. Businesses need sustainable alternatives that dont compromise on cost or performance.',
    solution: 'GreenLife has developed a proprietary blend of plant-based materials that match the durability and cost of plastic packaging, fully biodegrading within 90 days in natural environments.',
    businessModel: 'B2B sales to food & beverage companies, e-commerce businesses. Volume-based pricing with recurring contracts.',
    traction: '8 enterprise clients including 2 Fortune 500 companies, $180K monthly revenue, 3 patents filed.',
    teamSize: 8,
    location: 'Portland, OR',
    createdAt: '2024-01-10T14:35:00Z',
    likes: 63,
    views: 445,
    likedBy: ['i2', 'i3']
  },
  {
    id: 'idea3',
    entrepreneurId: 'e3',
    title: 'Real-Time Mental Health Platform',
    summary: 'Connecting patients with licensed mental health professionals within minutes, not weeks',
    industry: 'HealthTech',
    fundingNeeded: '$800K',
    stage: 'mvp',
    tags: ['Mental Health', 'Telehealth', 'Mobile', 'B2C'],
    problem: 'The average wait time to see a mental health professional is 25 days. 60% of people with mental health conditions receive no treatment. This crisis is worsening post-pandemic.',
    solution: 'HealthPulse matches patients with available licensed therapists in under 5 minutes via video, audio, or text. Our AI pre-screening ensures optimal therapist-patient matching.',
    businessModel: 'Per-session fees ($60-90) plus employer wellness plan subscriptions ($15/employee/month). Insurance partnerships in progress.',
    traction: '2,200 registered patients, 85 licensed therapists, 4.8/5 average rating, 68% month-over-month growth.',
    teamSize: 5,
    location: 'Boston, MA',
    createdAt: '2024-01-20T11:42:00Z',
    likes: 89,
    views: 678,
    likedBy: ['i1', 'i3']
  },
  {
    id: 'idea4',
    entrepreneurId: 'e4',
    title: 'IoT Vertical Farming for Urban Food Deserts',
    summary: 'Bringing fresh produce to underserved urban communities through smart vertical farms',
    industry: 'AgTech',
    fundingNeeded: '$3M',
    stage: 'growth',
    tags: ['IoT', 'Agriculture', 'Urban', 'Food Security'],
    problem: '23.5 million Americans live in food deserts with no access to fresh produce. Traditional farming cant serve dense urban areas. Current vertical farming solutions are too expensive to scale.',
    solution: 'UrbanFarm deploys IoT-enabled modular vertical farming units in warehouses and community spaces. Our proprietary sensor network reduces energy costs by 40% vs competitors.',
    businessModel: 'Revenue from fresh produce sales to local retailers and restaurants, plus licensing of our IoT farming technology to agricultural companies globally.',
    traction: '3 operational farms in Chicago, $220K monthly revenue, contracts with 12 local restaurant chains, expanding to 5 new cities.',
    teamSize: 14,
    location: 'Chicago, IL',
    createdAt: '2023-12-05T16:18:00Z',
    likes: 124,
    views: 891,
    likedBy: ['i2']
  }
];

export const addStartupIdea = (idea: Omit<StartupIdea, 'id' | 'createdAt' | 'likes' | 'views' | 'likedBy'>): StartupIdea => {
  const newIdea: StartupIdea = {
    ...idea,
    id: `idea${startupIdeas.length + 1}_${Date.now()}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    views: 0,
    likedBy: []
  };
  startupIdeas.push(newIdea);
  return newIdea;
};

export const toggleLikeIdea = (ideaId: string, userId: string): StartupIdea | null => {
  const idea = startupIdeas.find(i => i.id === ideaId);
  if (!idea) return null;
  if (idea.likedBy.includes(userId)) {
    idea.likedBy = idea.likedBy.filter(id => id !== userId);
    idea.likes = Math.max(0, idea.likes - 1);
  } else {
    idea.likedBy.push(userId);
    idea.likes += 1;
  }
  return idea;
};

export const incrementViews = (ideaId: string): void => {
  const idea = startupIdeas.find(i => i.id === ideaId);
  if (idea) idea.views += 1;
};

export const getIdeasByEntrepreneur = (entrepreneurId: string): StartupIdea[] => {
  return startupIdeas.filter(i => i.entrepreneurId === entrepreneurId);
};
