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
