export type Article = {
  slug: string;
  content?: string;
  title?: string;
  // emoji?: string;
  type?: 'example' | 'post' | 'diary';
  // topics?: string[];
  // tags?: string[];
  // published?: boolean;
  draft?: boolean;
  date: Date;
};

export type Props = {
  article: Article;
};

export type Book = {
  title: string;
  image_path: string;
  date: Date;
};

export type Index = {
  title: string;
  date: Date;
  draft: boolean;
};

export type Toc = {
  image_path: string;
};

export type IndexRaw = {
  title: string;
  date: string;
};

// 部分型
export type IndexPartial = { [P in 'title' | 'date']: Index[P] };

export type StringBook = {
  title: string;
  image_path: string;
  date: string; // toISOString
};
