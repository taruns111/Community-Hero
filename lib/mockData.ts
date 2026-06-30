// lib/mockData.ts - Comprehensive mock data for CivicAI

export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueStatus = 'Reported' | 'Verified' | 'Assigned' | 'In Progress' | 'Completed' | 'Rejected';
export type IssueCategory =
  | 'Pothole'
  | 'Garbage'
  | 'Water Leakage'
  | 'Street Light'
  | 'Drainage'
  | 'Road Damage'
  | 'Illegal Dumping'
  | 'Fallen Tree'
  | 'Traffic Signal'
  | 'Sewage'
  | 'Graffiti'
  | 'Noise Pollution';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
    ward: string;
    area: string;
  };
  images: string[];
  reportedBy: string;
  reportedByName: string;
  reportedByAvatar: string;
  department: string;
  votes: number;
  verifications: number;
  rejections: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  authenticityScore: number;
  spamProbability: number;
  duplicateCount: number;
  estimatedResolution: string;
  assignedTo?: string;
  statusHistory: StatusHistoryItem[];
  aiAnalysis: {
    confidence: number;
    detectedObjects: string[];
    suggestedPriority: number;
  };
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  helpful: number;
}

export interface StatusHistoryItem {
  status: IssueStatus;
  timestamp: string;
  updatedBy: string;
  note: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'citizen' | 'government' | 'admin';
  points: number;
  level: number;
  badges: string[];
  totalReports: number;
  verifiedReports: number;
  resolvedReports: number;
  joinedAt: string;
  ward: string;
  rank: number;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  issueCount: number;
  resolvedCount: number;
  avgResolutionDays: number;
}

export interface LocalityHealth {
  id: string;
  name: string;
  ward: string;
  score: number;
  pendingIssues: number;
  resolutionSpeed: number;
  cleanlinessScore: number;
  participationScore: number;
  safetyScore: number;
  trend: 'up' | 'down' | 'stable';
}

const mumbaiCoords = { lat: 19.076, lng: 72.8777 };

function randomOffset(range = 0.05) {
  return (Math.random() - 0.5) * range * 2;
}

export const mockIssues: Issue[] = [
  {
    id: 'ISS-001',
    title: 'Large Pothole on MG Road Near Signal',
    description: 'A large pothole approximately 2 feet wide has formed on MG Road near the main traffic signal, causing severe damage to vehicles and posing safety risks to two-wheelers. The pothole has been worsening since last week\'s rains.',
    category: 'Pothole',
    severity: 'Critical',
    status: 'In Progress',
    location: { lat: mumbaiCoords.lat + 0.012, lng: mumbaiCoords.lng + 0.018, address: '45 MG Road, Andheri West, Mumbai', ward: 'K/W Ward', area: 'Andheri West' },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600'],
    reportedBy: 'user-001',
    reportedByName: 'Rahul Sharma',
    reportedByAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    department: 'Road Maintenance',
    votes: 234,
    verifications: 47,
    rejections: 2,
    duplicateCount: 18,
    authenticityScore: 96,
    spamProbability: 2,
    estimatedResolution: '2-3 days',
    assignedTo: 'Officer Priya Mehta',
    createdAt: '2026-06-25T08:30:00Z',
    updatedAt: '2026-06-29T14:00:00Z',
    comments: [
      { id: 'c1', userId: 'u2', userName: 'Priya K', userAvatar: 'https://randomuser.me/api/portraits/women/2.jpg', text: 'My scooter got damaged here yesterday. This needs immediate attention!', createdAt: '2026-06-25T10:00:00Z', helpful: 45 },
      { id: 'c2', userId: 'u3', userName: 'Amit N', userAvatar: 'https://randomuser.me/api/portraits/men/3.jpg', text: 'Confirmed. The pothole is getting bigger with every vehicle that passes.', createdAt: '2026-06-26T09:15:00Z', helpful: 32 },
    ],
    statusHistory: [
      { status: 'Reported', timestamp: '2026-06-25T08:30:00Z', updatedBy: 'Rahul Sharma', note: 'Issue reported by citizen' },
      { status: 'Verified', timestamp: '2026-06-25T12:00:00Z', updatedBy: 'System', note: 'Verified by 47 community members' },
      { status: 'Assigned', timestamp: '2026-06-26T09:00:00Z', updatedBy: 'Supervisor', note: 'Assigned to Road Maintenance Division' },
      { status: 'In Progress', timestamp: '2026-06-29T08:00:00Z', updatedBy: 'Officer Priya Mehta', note: 'Repair crew dispatched' },
    ],
    aiAnalysis: { confidence: 96, detectedObjects: ['pothole', 'road surface', 'crack'], suggestedPriority: 1 },
  },
  {
    id: 'ISS-002',
    title: 'Overflowing Garbage Bin Near School',
    description: 'The municipal garbage bin near City Public School on Link Road has been overflowing for 3 days. Garbage is spilling onto the footpath creating unhygienic conditions near the school premises.',
    category: 'Garbage',
    severity: 'High',
    status: 'Verified',
    location: { lat: mumbaiCoords.lat - 0.008, lng: mumbaiCoords.lng + 0.025, address: 'Link Road Near City School, Malad West', ward: 'P/N Ward', area: 'Malad West' },
    images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600'],
    reportedBy: 'user-002',
    reportedByName: 'Sunita Patel',
    reportedByAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    department: 'Solid Waste Management',
    votes: 189,
    verifications: 38,
    rejections: 1,
    duplicateCount: 7,
    authenticityScore: 98,
    spamProbability: 1,
    estimatedResolution: '1 day',
    createdAt: '2026-06-27T07:00:00Z',
    updatedAt: '2026-06-28T11:00:00Z',
    comments: [
      { id: 'c3', userId: 'u4', userName: 'Meera V', userAvatar: 'https://randomuser.me/api/portraits/women/5.jpg', text: 'Children from the school are walking past this every day. Health hazard!', createdAt: '2026-06-27T09:00:00Z', helpful: 56 },
    ],
    statusHistory: [
      { status: 'Reported', timestamp: '2026-06-27T07:00:00Z', updatedBy: 'Sunita Patel', note: 'Issue reported by citizen' },
      { status: 'Verified', timestamp: '2026-06-27T15:00:00Z', updatedBy: 'System', note: 'Community verified' },
    ],
    aiAnalysis: { confidence: 98, detectedObjects: ['garbage bin', 'waste', 'footpath'], suggestedPriority: 2 },
  },
  {
    id: 'ISS-003',
    title: 'Broken Street Light - Dangerous Dark Stretch',
    description: 'Three consecutive street lights on Marine Drive stretch near Hotel Sea Queen have been non-functional for a week. This 200m stretch is completely dark at night, making it unsafe for pedestrians and causing accidents.',
    category: 'Street Light',
    severity: 'High',
    status: 'Assigned',
    location: { lat: mumbaiCoords.lat + 0.003, lng: mumbaiCoords.lng - 0.012, address: 'Marine Drive, Near Hotel Sea Queen, South Mumbai', ward: 'A Ward', area: 'Marine Drive' },
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600'],
    reportedBy: 'user-003',
    reportedByName: 'Arjun Das',
    reportedByAvatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    department: 'Electrical Department',
    votes: 156,
    verifications: 29,
    rejections: 0,
    duplicateCount: 5,
    authenticityScore: 94,
    spamProbability: 3,
    estimatedResolution: '3 days',
    assignedTo: 'Officer Vikram Singh',
    createdAt: '2026-06-24T20:00:00Z',
    updatedAt: '2026-06-28T10:00:00Z',
    comments: [],
    statusHistory: [
      { status: 'Reported', timestamp: '2026-06-24T20:00:00Z', updatedBy: 'Arjun Das', note: 'Issue reported by citizen' },
      { status: 'Verified', timestamp: '2026-06-25T10:00:00Z', updatedBy: 'System', note: 'Community verified' },
      { status: 'Assigned', timestamp: '2026-06-27T09:00:00Z', updatedBy: 'Supervisor', note: 'Assigned to Electrical Division' },
    ],
    aiAnalysis: { confidence: 89, detectedObjects: ['street light', 'road', 'night'], suggestedPriority: 2 },
  },
  {
    id: 'ISS-004',
    title: 'Water Pipeline Burst - Major Leakage',
    description: 'A major water pipeline has burst near Dadar Circle causing water wastage and flooding the road. The leakage has been going on for 6 hours and the road is flooded with 2-3 inches of water.',
    category: 'Water Leakage',
    severity: 'Critical',
    status: 'Completed',
    location: { lat: mumbaiCoords.lat - 0.018, lng: mumbaiCoords.lng + 0.005, address: 'Dadar Circle, Near Shivaji Park, Dadar', ward: 'G/N Ward', area: 'Dadar' },
    images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600'],
    reportedBy: 'user-004',
    reportedByName: 'Kavita Joshi',
    reportedByAvatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    department: 'Water Supply',
    votes: 312,
    verifications: 61,
    rejections: 0,
    duplicateCount: 23,
    authenticityScore: 99,
    spamProbability: 0,
    estimatedResolution: 'Completed',
    assignedTo: 'Emergency Team Alpha',
    resolvedAt: '2026-06-28T18:00:00Z',
    createdAt: '2026-06-28T10:00:00Z',
    updatedAt: '2026-06-28T18:00:00Z',
    comments: [
      { id: 'c5', userId: 'u6', userName: 'Ravi M', userAvatar: 'https://randomuser.me/api/portraits/men/8.jpg', text: 'Fixed! The team came within 4 hours. Great response!', createdAt: '2026-06-28T19:00:00Z', helpful: 78 },
    ],
    statusHistory: [
      { status: 'Reported', timestamp: '2026-06-28T10:00:00Z', updatedBy: 'Kavita Joshi', note: 'Emergency report' },
      { status: 'Verified', timestamp: '2026-06-28T10:30:00Z', updatedBy: 'System', note: 'Auto-verified emergency' },
      { status: 'Assigned', timestamp: '2026-06-28T11:00:00Z', updatedBy: 'Control Room', note: 'Emergency team dispatched' },
      { status: 'In Progress', timestamp: '2026-06-28T12:00:00Z', updatedBy: 'Emergency Team', note: 'On-site repair in progress' },
      { status: 'Completed', timestamp: '2026-06-28T18:00:00Z', updatedBy: 'Emergency Team Alpha', note: 'Pipeline repaired successfully' },
    ],
    aiAnalysis: { confidence: 99, detectedObjects: ['water leak', 'pipe', 'flooding', 'road'], suggestedPriority: 1 },
  },
  {
    id: 'ISS-005',
    title: 'Blocked Drainage Causing Street Flooding',
    description: 'The storm drain on SV Road near Borivali Station is completely blocked with debris and garbage, causing street flooding even during light rain. The surrounding shops and residences are affected.',
    category: 'Drainage',
    severity: 'High',
    status: 'In Progress',
    location: { lat: mumbaiCoords.lat + 0.038, lng: mumbaiCoords.lng + 0.022, address: 'SV Road, Near Borivali Station, Borivali West', ward: 'R/N Ward', area: 'Borivali' },
    images: ['https://images.unsplash.com/photo-1530126483408-aa533e55bdb2?w=600'],
    reportedBy: 'user-005',
    reportedByName: 'Nikhil Rao',
    reportedByAvatar: 'https://randomuser.me/api/portraits/men/9.jpg',
    department: 'Storm Water Drainage',
    votes: 198,
    verifications: 42,
    rejections: 3,
    duplicateCount: 11,
    authenticityScore: 93,
    spamProbability: 4,
    estimatedResolution: '4 days',
    assignedTo: 'Drainage Team 3',
    createdAt: '2026-06-26T13:00:00Z',
    updatedAt: '2026-06-29T09:00:00Z',
    comments: [],
    statusHistory: [
      { status: 'Reported', timestamp: '2026-06-26T13:00:00Z', updatedBy: 'Nikhil Rao', note: '' },
      { status: 'Verified', timestamp: '2026-06-26T17:00:00Z', updatedBy: 'System', note: '' },
      { status: 'Assigned', timestamp: '2026-06-27T09:00:00Z', updatedBy: 'Supervisor', note: '' },
      { status: 'In Progress', timestamp: '2026-06-29T09:00:00Z', updatedBy: 'Drainage Team 3', note: 'Desilting operation started' },
    ],
    aiAnalysis: { confidence: 91, detectedObjects: ['drain', 'debris', 'flooding'], suggestedPriority: 2 },
  },
  {
    id: 'ISS-006',
    title: 'Illegal Dumping of Construction Waste',
    description: 'Construction debris and building waste has been illegally dumped on the public land near Kandivali East Metro Station. The dump is growing and blocking pedestrian access.',
    category: 'Illegal Dumping',
    severity: 'Medium',
    status: 'Reported',
    location: { lat: mumbaiCoords.lat + 0.028, lng: mumbaiCoords.lng + 0.030, address: 'Near Kandivali Metro Station, Kandivali East', ward: 'R/C Ward', area: 'Kandivali' },
    images: ['https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=600'],
    reportedBy: 'user-006',
    reportedByName: 'Sanjay Gupta',
    reportedByAvatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    department: 'Solid Waste Management',
    votes: 89,
    verifications: 19,
    rejections: 1,
    duplicateCount: 3,
    authenticityScore: 91,
    spamProbability: 5,
    estimatedResolution: '7 days',
    createdAt: '2026-06-29T09:00:00Z',
    updatedAt: '2026-06-29T09:00:00Z',
    comments: [],
    statusHistory: [
      { status: 'Reported', timestamp: '2026-06-29T09:00:00Z', updatedBy: 'Sanjay Gupta', note: '' },
    ],
    aiAnalysis: { confidence: 88, detectedObjects: ['construction waste', 'debris', 'sidewalk'], suggestedPriority: 3 },
  },
  {
    id: 'ISS-007',
    title: 'Traffic Signal Malfunction at Busy Intersection',
    description: 'The traffic signal at Chembur Naka is stuck on green for one direction causing chaos during peak hours. Several near-miss accidents have been reported in the last 2 days.',
    category: 'Traffic Signal',
    severity: 'Critical',
    status: 'Assigned',
    location: { lat: mumbaiCoords.lat - 0.025, lng: mumbaiCoords.lng + 0.038, address: 'Chembur Naka Intersection, Chembur', ward: 'M/E Ward', area: 'Chembur' },
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600'],
    reportedBy: 'user-007',
    reportedByName: 'Divya Nair',
    reportedByAvatar: 'https://randomuser.me/api/portraits/women/11.jpg',
    department: 'Traffic Engineering',
    votes: 267,
    verifications: 53,
    rejections: 1,
    duplicateCount: 14,
    authenticityScore: 97,
    spamProbability: 1,
    estimatedResolution: '1 day',
    assignedTo: 'Traffic Signal Division',
    createdAt: '2026-06-28T07:00:00Z',
    updatedAt: '2026-06-29T10:00:00Z',
    comments: [],
    statusHistory: [
      { status: 'Reported', timestamp: '2026-06-28T07:00:00Z', updatedBy: 'Divya Nair', note: '' },
      { status: 'Verified', timestamp: '2026-06-28T09:00:00Z', updatedBy: 'System', note: '' },
      { status: 'Assigned', timestamp: '2026-06-28T11:00:00Z', updatedBy: 'Control', note: 'Assigned to signal maintenance team' },
    ],
    aiAnalysis: { confidence: 95, detectedObjects: ['traffic light', 'intersection', 'vehicles'], suggestedPriority: 1 },
  },
  {
    id: 'ISS-008',
    title: 'Fallen Tree Blocking Road After Storm',
    description: 'A large tree has fallen across the entire width of the road on Carter Road in Bandra, completely blocking traffic. The tree fell during last night\'s storm and has been there since morning.',
    category: 'Fallen Tree',
    severity: 'High',
    status: 'Completed',
    location: { lat: mumbaiCoords.lat - 0.005, lng: mumbaiCoords.lng - 0.018, address: 'Carter Road, Bandra West, Mumbai', ward: 'H/W Ward', area: 'Bandra West' },
    images: ['https://images.unsplash.com/photo-1620674156104-0a9d70f29b82?w=600'],
    reportedBy: 'user-008',
    reportedByName: 'Rohit Khurana',
    reportedByAvatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    department: 'Garden Department',
    votes: 445,
    verifications: 89,
    rejections: 0,
    duplicateCount: 31,
    authenticityScore: 99,
    spamProbability: 0,
    estimatedResolution: 'Completed',
    resolvedAt: '2026-06-29T14:00:00Z',
    createdAt: '2026-06-29T06:00:00Z',
    updatedAt: '2026-06-29T14:00:00Z',
    comments: [
      { id: 'c8', userId: 'u9', userName: 'Ananya S', userAvatar: 'https://randomuser.me/api/portraits/women/13.jpg', text: 'Tree cleared! Excellent response time from the team.', createdAt: '2026-06-29T15:00:00Z', helpful: 112 },
    ],
    statusHistory: [
      { status: 'Reported', timestamp: '2026-06-29T06:00:00Z', updatedBy: 'Rohit Khurana', note: '' },
      { status: 'Verified', timestamp: '2026-06-29T06:30:00Z', updatedBy: 'System', note: '' },
      { status: 'Assigned', timestamp: '2026-06-29T07:00:00Z', updatedBy: 'Supervisor', note: '' },
      { status: 'In Progress', timestamp: '2026-06-29T09:00:00Z', updatedBy: 'Garden Dept', note: 'Team on site' },
      { status: 'Completed', timestamp: '2026-06-29T14:00:00Z', updatedBy: 'Garden Team', note: 'Tree removed, road cleared' },
    ],
    aiAnalysis: { confidence: 99, detectedObjects: ['fallen tree', 'road', 'blockage'], suggestedPriority: 1 },
  },
  {
    id: 'ISS-009',
    title: 'Sewage Overflow Near Residential Colony',
    description: 'Sewage is overflowing from a manhole in the middle of the residential street in Powai causing severe stench and health hazard. Children playing in the area are at serious risk.',
    category: 'Sewage',
    severity: 'Critical',
    status: 'In Progress',
    location: { lat: mumbaiCoords.lat + 0.015, lng: mumbaiCoords.lng + 0.042, address: 'Hiranandani Gardens, Powai, Mumbai', ward: 'L Ward', area: 'Powai' },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    reportedBy: 'user-009',
    reportedByName: 'Aisha Khan',
    reportedByAvatar: 'https://randomuser.me/api/portraits/women/14.jpg',
    department: 'Sewage Management',
    votes: 378,
    verifications: 71,
    rejections: 2,
    duplicateCount: 16,
    authenticityScore: 97,
    spamProbability: 2,
    estimatedResolution: '2 days',
    assignedTo: 'Sewage Team Alpha',
    createdAt: '2026-06-28T15:00:00Z',
    updatedAt: '2026-06-29T11:00:00Z',
    comments: [],
    statusHistory: [
      { status: 'Reported', timestamp: '2026-06-28T15:00:00Z', updatedBy: 'Aisha Khan', note: '' },
      { status: 'Verified', timestamp: '2026-06-28T17:00:00Z', updatedBy: 'System', note: '' },
      { status: 'Assigned', timestamp: '2026-06-29T08:00:00Z', updatedBy: 'Control', note: '' },
      { status: 'In Progress', timestamp: '2026-06-29T11:00:00Z', updatedBy: 'Sewage Team Alpha', note: 'Pumping out sewage' },
    ],
    aiAnalysis: { confidence: 97, detectedObjects: ['manhole', 'sewage', 'overflow'], suggestedPriority: 1 },
  },
  {
    id: 'ISS-010',
    title: 'Road Damage - Multiple Cracks After Heavy Rain',
    description: 'Extensive road damage with multiple cracks and depressions has appeared on the stretch from Ghatkopar to Vikhroli after continuous heavy rainfall. The road surface is breaking apart in places.',
    category: 'Road Damage',
    severity: 'High',
    status: 'Verified',
    location: { lat: mumbaiCoords.lat - 0.012, lng: mumbaiCoords.lng + 0.048, address: 'LBS Marg, Ghatkopar to Vikhroli Stretch', ward: 'N Ward', area: 'Ghatkopar' },
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600'],
    reportedBy: 'user-010',
    reportedByName: 'Vikram Desai',
    reportedByAvatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    department: 'Road Maintenance',
    votes: 201,
    verifications: 44,
    rejections: 2,
    duplicateCount: 9,
    authenticityScore: 92,
    spamProbability: 4,
    estimatedResolution: '5 days',
    createdAt: '2026-06-27T11:00:00Z',
    updatedAt: '2026-06-28T16:00:00Z',
    comments: [],
    statusHistory: [
      { status: 'Reported', timestamp: '2026-06-27T11:00:00Z', updatedBy: 'Vikram Desai', note: '' },
      { status: 'Verified', timestamp: '2026-06-28T10:00:00Z', updatedBy: 'System', note: '' },
    ],
    aiAnalysis: { confidence: 92, detectedObjects: ['road crack', 'asphalt damage', 'pothole'], suggestedPriority: 2 },
  },
];

// Generate more issues dynamically
for (let i = 11; i <= 50; i++) {
  const categories: IssueCategory[] = ['Pothole', 'Garbage', 'Water Leakage', 'Street Light', 'Drainage', 'Road Damage', 'Illegal Dumping', 'Fallen Tree', 'Traffic Signal', 'Sewage', 'Graffiti', 'Noise Pollution'];
  const severities: IssueSeverity[] = ['Low', 'Medium', 'High', 'Critical'];
  const statuses: IssueStatus[] = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Completed'];
  const areas = ['Andheri', 'Bandra', 'Dadar', 'Borivali', 'Thane', 'Kurla', 'Mulund', 'Goregaon', 'Malad', 'Kandivali'];
  const category = categories[i % categories.length];
  const severity = severities[Math.floor(i / 10) % severities.length];
  const status = statuses[i % statuses.length];
  const area = areas[i % areas.length];

  mockIssues.push({
    id: `ISS-${String(i).padStart(3, '0')}`,
    title: `${category} Issue in ${area} - Report #${i}`,
    description: `A ${severity.toLowerCase()} severity ${category.toLowerCase()} issue has been reported in the ${area} area. Immediate attention is required from the concerned department.`,
    category,
    severity,
    status,
    location: {
      lat: mumbaiCoords.lat + randomOffset(0.06),
      lng: mumbaiCoords.lng + randomOffset(0.06),
      address: `${area}, Mumbai`,
      ward: `Ward ${i % 10}`,
      area,
    },
    images: [`https://picsum.photos/seed/${i}/600/400`],
    reportedBy: `user-${String(i % 10).padStart(3, '0')}`,
    reportedByName: ['Rahul S', 'Priya K', 'Amit N', 'Kavita J', 'Nikhil R', 'Sanjay G', 'Divya N', 'Rohit K', 'Aisha M', 'Vikram D'][i % 10],
    reportedByAvatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${(i % 50) + 1}.jpg`,
    department: ['Road Maintenance', 'Solid Waste Management', 'Water Supply', 'Electrical Department', 'Storm Water Drainage'][i % 5],
    votes: Math.floor(Math.random() * 300) + 20,
    verifications: Math.floor(Math.random() * 60) + 5,
    rejections: Math.floor(Math.random() * 5),
    duplicateCount: Math.floor(Math.random() * 15),
    authenticityScore: Math.floor(Math.random() * 20) + 80,
    spamProbability: Math.floor(Math.random() * 10),
    estimatedResolution: ['1 day', '2-3 days', '5 days', '1 week', '2 weeks'][i % 5],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [],
    statusHistory: [{ status: 'Reported', timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), updatedBy: 'Citizen', note: 'Reported by citizen' }],
    aiAnalysis: { confidence: Math.floor(Math.random() * 20) + 80, detectedObjects: [category.toLowerCase()], suggestedPriority: Math.floor(Math.random() * 4) + 1 },
  });
}

export const mockUsers: User[] = [
  { id: 'user-001', name: 'Rahul Sharma', email: 'rahul@example.com', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', role: 'citizen', points: 4250, level: 12, badges: ['First Reporter', 'Community Hero', 'Problem Solver', 'Neighborhood Guardian', 'Top Contributor'], totalReports: 47, verifiedReports: 39, resolvedReports: 31, joinedAt: '2025-01-15T00:00:00Z', ward: 'K/W Ward', rank: 1 },
  { id: 'user-002', name: 'Sunita Patel', email: 'sunita@example.com', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', role: 'citizen', points: 3890, level: 11, badges: ['First Reporter', 'Community Hero', 'Problem Solver', 'Monthly Champion'], totalReports: 42, verifiedReports: 35, resolvedReports: 28, joinedAt: '2025-02-20T00:00:00Z', ward: 'P/N Ward', rank: 2 },
  { id: 'user-003', name: 'Arjun Das', email: 'arjun@example.com', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', role: 'citizen', points: 3540, level: 10, badges: ['First Reporter', 'Community Hero', 'Top Contributor'], totalReports: 38, verifiedReports: 31, resolvedReports: 24, joinedAt: '2025-03-10T00:00:00Z', ward: 'A Ward', rank: 3 },
  { id: 'user-004', name: 'Kavita Joshi', email: 'kavita@example.com', avatar: 'https://randomuser.me/api/portraits/women/7.jpg', role: 'citizen', points: 3120, level: 9, badges: ['First Reporter', 'Problem Solver'], totalReports: 33, verifiedReports: 28, resolvedReports: 22, joinedAt: '2025-04-05T00:00:00Z', ward: 'G/N Ward', rank: 4 },
  { id: 'user-005', name: 'Nikhil Rao', email: 'nikhil@example.com', avatar: 'https://randomuser.me/api/portraits/men/9.jpg', role: 'citizen', points: 2890, level: 8, badges: ['First Reporter', 'Community Hero'], totalReports: 29, verifiedReports: 24, resolvedReports: 19, joinedAt: '2025-04-22T00:00:00Z', ward: 'R/N Ward', rank: 5 },
  { id: 'user-006', name: 'Sanjay Gupta', email: 'sanjay@example.com', avatar: 'https://randomuser.me/api/portraits/men/10.jpg', role: 'citizen', points: 2450, level: 7, badges: ['First Reporter'], totalReports: 25, verifiedReports: 20, resolvedReports: 15, joinedAt: '2025-05-10T00:00:00Z', ward: 'R/C Ward', rank: 6 },
  { id: 'user-007', name: 'Divya Nair', email: 'divya@example.com', avatar: 'https://randomuser.me/api/portraits/women/11.jpg', role: 'citizen', points: 2210, level: 7, badges: ['First Reporter', 'Problem Solver'], totalReports: 22, verifiedReports: 18, resolvedReports: 14, joinedAt: '2025-05-28T00:00:00Z', ward: 'M/E Ward', rank: 7 },
  { id: 'user-008', name: 'Rohit Khurana', email: 'rohit@example.com', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', role: 'citizen', points: 1980, level: 6, badges: ['First Reporter'], totalReports: 19, verifiedReports: 15, resolvedReports: 12, joinedAt: '2025-06-01T00:00:00Z', ward: 'H/W Ward', rank: 8 },
  { id: 'user-009', name: 'Aisha Khan', email: 'aisha@example.com', avatar: 'https://randomuser.me/api/portraits/women/14.jpg', role: 'citizen', points: 1750, level: 5, badges: ['First Reporter'], totalReports: 17, verifiedReports: 13, resolvedReports: 10, joinedAt: '2025-06-15T00:00:00Z', ward: 'L Ward', rank: 9 },
  { id: 'user-010', name: 'Vikram Desai', email: 'vikram@example.com', avatar: 'https://randomuser.me/api/portraits/men/15.jpg', role: 'citizen', points: 1520, level: 5, badges: ['First Reporter'], totalReports: 15, verifiedReports: 11, resolvedReports: 8, joinedAt: '2025-06-20T00:00:00Z', ward: 'N Ward', rank: 10 },
];

export const mockDepartments: Department[] = [
  { id: 'dept-1', name: 'Road Maintenance', shortName: 'Roads', color: '#f97316', icon: '🛣️', issueCount: 142, resolvedCount: 118, avgResolutionDays: 3.2 },
  { id: 'dept-2', name: 'Solid Waste Management', shortName: 'Waste', color: '#22c55e', icon: '♻️', issueCount: 89, resolvedCount: 71, avgResolutionDays: 1.8 },
  { id: 'dept-3', name: 'Water Supply', shortName: 'Water', color: '#3b82f6', icon: '💧', issueCount: 67, resolvedCount: 52, avgResolutionDays: 4.1 },
  { id: 'dept-4', name: 'Electrical Department', shortName: 'Electric', color: '#eab308', icon: '⚡', issueCount: 54, resolvedCount: 41, avgResolutionDays: 2.5 },
  { id: 'dept-5', name: 'Storm Water Drainage', shortName: 'Drainage', color: '#8b5cf6', icon: '🌊', issueCount: 78, resolvedCount: 59, avgResolutionDays: 5.0 },
  { id: 'dept-6', name: 'Traffic Engineering', shortName: 'Traffic', color: '#ef4444', icon: '🚦', issueCount: 43, resolvedCount: 38, avgResolutionDays: 1.2 },
  { id: 'dept-7', name: 'Garden Department', shortName: 'Garden', color: '#10b981', icon: '🌳', issueCount: 31, resolvedCount: 28, avgResolutionDays: 2.1 },
  { id: 'dept-8', name: 'Sewage Management', shortName: 'Sewage', color: '#6b7280', icon: '🔧', issueCount: 45, resolvedCount: 33, avgResolutionDays: 3.8 },
];

export const mockLocalityHealth: LocalityHealth[] = [
  { id: 'loc-1', name: 'Bandra West', ward: 'H/W Ward', score: 87, pendingIssues: 12, resolutionSpeed: 92, cleanlinessScore: 85, participationScore: 78, safetyScore: 90, trend: 'up' },
  { id: 'loc-2', name: 'Andheri West', ward: 'K/W Ward', score: 74, pendingIssues: 28, resolutionSpeed: 78, cleanlinessScore: 70, participationScore: 82, safetyScore: 75, trend: 'stable' },
  { id: 'loc-3', name: 'Powai', ward: 'L Ward', score: 82, pendingIssues: 18, resolutionSpeed: 85, cleanlinessScore: 88, participationScore: 76, safetyScore: 83, trend: 'up' },
  { id: 'loc-4', name: 'Dadar', ward: 'G/N Ward', score: 68, pendingIssues: 35, resolutionSpeed: 72, cleanlinessScore: 65, participationScore: 70, safetyScore: 72, trend: 'down' },
  { id: 'loc-5', name: 'Borivali West', ward: 'R/N Ward', score: 71, pendingIssues: 31, resolutionSpeed: 75, cleanlinessScore: 68, participationScore: 73, safetyScore: 74, trend: 'stable' },
  { id: 'loc-6', name: 'Marine Drive', ward: 'A Ward', score: 91, pendingIssues: 8, resolutionSpeed: 95, cleanlinessScore: 94, participationScore: 85, safetyScore: 92, trend: 'up' },
  { id: 'loc-7', name: 'Ghatkopar', ward: 'N Ward', score: 63, pendingIssues: 42, resolutionSpeed: 65, cleanlinessScore: 60, participationScore: 67, safetyScore: 65, trend: 'down' },
  { id: 'loc-8', name: 'Malad West', ward: 'P/N Ward', score: 76, pendingIssues: 24, resolutionSpeed: 80, cleanlinessScore: 74, participationScore: 79, safetyScore: 77, trend: 'up' },
  { id: 'loc-9', name: 'Chembur', ward: 'M/E Ward', score: 65, pendingIssues: 38, resolutionSpeed: 68, cleanlinessScore: 62, participationScore: 71, safetyScore: 66, trend: 'stable' },
  { id: 'loc-10', name: 'Kandivali East', ward: 'R/C Ward', score: 79, pendingIssues: 21, resolutionSpeed: 83, cleanlinessScore: 77, participationScore: 81, safetyScore: 80, trend: 'up' },
  { id: 'loc-11', name: 'Goregaon West', ward: 'P/S Ward', score: 72, pendingIssues: 29, resolutionSpeed: 76, cleanlinessScore: 70, participationScore: 74, safetyScore: 73, trend: 'stable' },
  { id: 'loc-12', name: 'Mulund West', ward: 'T Ward', score: 84, pendingIssues: 16, resolutionSpeed: 88, cleanlinessScore: 82, participationScore: 80, safetyScore: 86, trend: 'up' },
];

export const monthlyData = [
  { month: 'Jan', reported: 234, resolved: 198, inProgress: 36 },
  { month: 'Feb', reported: 289, resolved: 241, inProgress: 48 },
  { month: 'Mar', reported: 312, resolved: 278, inProgress: 34 },
  { month: 'Apr', reported: 278, resolved: 245, inProgress: 33 },
  { month: 'May', reported: 356, resolved: 301, inProgress: 55 },
  { month: 'Jun', reported: 398, resolved: 334, inProgress: 64 },
];

export const categoryDistribution = [
  { name: 'Pothole', value: 28, color: '#ef4444' },
  { name: 'Garbage', value: 22, color: '#f97316' },
  { name: 'Water Leakage', value: 15, color: '#3b82f6' },
  { name: 'Street Light', value: 12, color: '#eab308' },
  { name: 'Drainage', value: 10, color: '#8b5cf6' },
  { name: 'Road Damage', value: 8, color: '#ec4899' },
  { name: 'Others', value: 5, color: '#6b7280' },
];

export const resolutionTrend = [
  { week: 'W1', avgDays: 5.2 },
  { week: 'W2', avgDays: 4.8 },
  { week: 'W3', avgDays: 4.1 },
  { week: 'W4', avgDays: 3.9 },
  { week: 'W5', avgDays: 3.5 },
  { week: 'W6', avgDays: 3.2 },
  { week: 'W7', avgDays: 2.9 },
  { week: 'W8', avgDays: 2.7 },
];

export const currentUser: User = mockUsers[0];

export const getStatusColor = (status: IssueStatus): string => {
  const colors: Record<IssueStatus, string> = {
    Reported: 'bg-gray-500',
    Verified: 'bg-blue-500',
    Assigned: 'bg-purple-500',
    'In Progress': 'bg-yellow-500',
    Completed: 'bg-green-500',
    Rejected: 'bg-red-500',
  };
  return colors[status];
};

export const getSeverityColor = (severity: IssueSeverity): string => {
  const colors: Record<IssueSeverity, string> = {
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[severity];
};

export const getCategoryIcon = (category: IssueCategory): string => {
  const icons: Record<IssueCategory, string> = {
    Pothole: '🕳️',
    Garbage: '🗑️',
    'Water Leakage': '💧',
    'Street Light': '💡',
    Drainage: '🌊',
    'Road Damage': '🛣️',
    'Illegal Dumping': '⚠️',
    'Fallen Tree': '🌳',
    'Traffic Signal': '🚦',
    Sewage: '🔧',
    Graffiti: '🎨',
    'Noise Pollution': '🔊',
  };
  return icons[category];
};
