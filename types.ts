
export enum View {
  CHAT = 'chat',
  TEMPLATES = 'templates',
  BRANDS = 'brands',
  LIBRARY = 'library',
  ANALYTICS = 'analytics',
  PLANS = 'plans',
  ABOUT = 'about',
  SETTINGS = 'settings',
  PROFILE = 'profile'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  image?: string; // Original uploaded image in user message
  overlayImage?: string; // Image to be displayed as overlay in assistant message
}

export interface NavItem {
  id: View;
  label: string;
  icon: string;
}

export interface LibraryFolder {
  id: string;
  name: string;
  brandId?: string; // Optional: Link folder to a specific client
  createdAt: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  content: string;
  hashtags: string;
  imageSearchTerm: string;
  imageUrl?: string | null;
  overlayImageUrl?: string | null; // Persistence for the integrated overlay image
  brandName: string;
  brandColor: string;
  timestamp: number;
  // Novos campos para Analytics
  platformId?: string;
  personaId?: string;
  folderId?: string; // Link to a folder
}
