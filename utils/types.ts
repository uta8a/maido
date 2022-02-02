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
  book_path: string;
  draft: boolean;
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
  draft: boolean;
};

export type StringBook = {
  title: string;
  image_path: string;
  date: string; // toISOString
  book_path: string;
};

export type ArticleLayout = {
  list_px: number;
  toc_px: number;
};

export type ArticleProps = {
  meta: IndexRaw;
  list: string;
  content: string;
  toc: string;
};
