
export interface Novel {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  tags: string[];
  rating: number;
  chapters: number;
  views: number;
  likes: number;
  summary: string;
  lastUpdated: string;
  isNew: boolean;
  isHot: boolean;
  isFeatured: boolean;
  type: string;
  isManga?: boolean; // Flag to indicate if this is a manga
}

export interface NovelChapter {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  views: number;
}

