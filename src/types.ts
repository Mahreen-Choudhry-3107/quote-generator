export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  context?: string;
}

export type DesignLayout = 'editorial' | 'minimalist' | 'brutalist' | 'focus';
