
export interface WorldItem {
  id: string;
  title: string;
  category: 'law' | 'architecture' | 'flora' | 'fauna' | 'culture' | 'technology';
  description: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  likes: number;
  views: number;
  images: string[];
  isPublic: boolean;
  worldId: string;
}

export interface World {
  id: string;
  name: string;
  description: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags: string[];
  items: WorldItem[];
  collaborators: string[];
}

export const WORLD_CATEGORIES = {
  law: '法律制度',
  architecture: '建築設計',
  flora: '植物生態',
  fauna: '動物生態',
  culture: '文化習俗',
  technology: '科技發明'
} as const;
