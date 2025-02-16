export interface NewsItem {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
      name: string;
    };
    category?: string;
    relevanceScore?: number;
  }