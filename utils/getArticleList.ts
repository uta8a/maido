import { Book, Index, Toc, IndexRaw } from './types';
import { documentRoot, bookToc } from './constants';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import toml from 'toml';
import MarkdownIt from 'markdown-it';

const getArticleList = async (bookPath: string): Promise<string> => {
  const md = new MarkdownIt();
  const tocPath = path.join(bookPath, bookToc);
  const content = await getTocContent(tocPath);
  const articleList = md.render(content);
  return articleList;
};

const getTocContent = async (tocPath: string): Promise<string> => {
  let fileRaw;
  try {
    fileRaw = fs.readFileSync(tocPath, 'utf-8');
  } catch {
    return '';
  }
  const metadata = getTocMd(fileRaw);
  return metadata;
};

// str === toc.md's content
const getTocMd = (str: string): string => {
  const rawData = matter(str, {
    engines: {
      toml: toml.parse.bind(toml),
    },
    language: 'toml',
    delimiters: '+++',
  });
  return rawData.content;
};

export { getArticleList, getTocMd, getTocContent };
