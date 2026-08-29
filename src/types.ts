export type NavigationPage = 
  | 'home' 
  | 'about' 
  | 'fellowships' 
  | 'executives' 
  | 'events' 
  | 'announcements' 
  | 'media' 
  | 'resources' 
  | 'give' 
  | 'contact' 
  | 'get-involved'
  | 'admin';

export interface Fellowship {
  id: string;
  name: string;
  acronym: string;
  motto: string;
  category: 'Evangelical' | 'Denominational' | 'Inter-denominational' | 'Pentecostal';
  meetingVenue: string;
  meetingDays: string;
  meetingTime: string;
  presidentName: string;
  presidentContact: string;
  bannerImage: string;
  description: string;
  establishedYear: string;
  futaLocation: string;
  mapUrl?: string;
  socialLink?: string;
  membershipSize?: string;
}

export interface ServiceUnit {
  id: string;
  name: string;
  shortName: string;
  motto: string;
  headName: string;
  headTitle: string;
  description: string;
  duties?: string[];
  meetingTime?: string;
  venue?: string;
  skillsNeeded?: string[];
}

export interface FellowshipEvent {
  id: string;
  title: string;
  theme?: string;
  category: 'Mega Service' | 'Conference' | 'Teaching Weekend' | 'Prayer' | 'Outreach' | 'Special';
  date: string;
  time: string;
  venue: string;
  description: string;
  isUpcoming: boolean;
  minister?: string;
  isFeatured?: boolean;
  image: string;
  scheduleDetails?: string[];
  registrationRequired?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Official Notice' | 'Spiritual' | 'Welfare' | 'Event Alert' | 'Secretariat';
  date: string;
  author: string;
  summary: string;
  content: string;
  isFeatured?: boolean;
  badgeColor?: string;
  actionUrl?: string;
  actionText?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  category: 'Sermon' | 'Mega Praise' | 'Worship' | 'Seminar' | 'Podcast';
  duration: string;
  date: string;
  minister: string;
  thumbnail: string;
  youtubeId: string;
  description: string;
  views?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Constitutional' | 'Manuals' | 'Sermons' | 'Documents' | 'Bulletins';
  fileType: 'PDF' | 'DOCX' | 'MP3' | 'ZIP';
  fileSize: string;
  downloadCount: number;
  dateAdded: string;
  description: string;
  downloadUrl: string;
  level?: string;
}

export interface ExecutiveLeader {
  id: string;
  name: string;
  office: string;
  level: string;
  department: string;
  quote: string;
  photoUrl: string;
  phone: string;
  email: string;
  tenure?: string;
}

export interface HistoricalExecutive {
  id?: string;
  tenure: string; // Generation / Year of serving e.g. '2024/2025'
  generationName: string; // Generational Name e.g. 'The Trailblazers'
  theme?: string; // Generational Theme / Slogan
  president: string; // President
  executivesList?: string; // Other executive members
  mission?: string; // Generational Mission
  vision?: string; // Generational Vision
  keyAchievements: string[]; // Key milestones & achievements
  photoUrl?: string; // Portrait or executive photo
  secretary?: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  tag: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  purpose: string;
  date: string;
  reference: string;
  paymentMethod: 'OPay' | 'PalmPay' | 'Bank Transfer' | 'Card';
  status: 'Completed' | 'Pending';
  channelDetails?: string;
}

export interface AuthorizedAdmin {
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'executive';
  addedAt: string;
  addedBy?: string;
}

export interface SystemSettings {
  academicSession: string;
  annualTheme: string;
  themeScripture: string;
  officeEmail: string;
  officePhone: string;
  chapelAddress: string;
  superadminPin: string;
  executivePin?: string;
  superadminEmail: string;
  authorizedAdminEmails?: string[];
  authorizedAdminList?: AuthorizedAdmin[];
  opayMerchantAccount: string;
  opayMerchantName: string;
  palmpayMerchantAccount: string;
  palmpayMerchantName: string;
  youtubeChannelHandle?: string;
  youtubeChannelName?: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'auth' | 'settings';
}

