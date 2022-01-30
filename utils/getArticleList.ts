import { Book, Index, Toc, IndexRaw } from './types';
import { documentRoot, bookToc } from './constants';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import toml from 'toml';
import MarkdownIt from 'markdown-it';
import { DOMParser } from 'linkedom';

const getArticleList = async (bookPath: string): Promise<string> => {
  const md = new MarkdownIt();
  const domParser = new DOMParser();

  const tocPath = path.join(bookPath, bookToc);
  const rawContent = await getTocContent(tocPath);
  const articleListString = md.render(rawContent);
  const document = domParser.parseFromString(articleListString, 'text/html');
  document.querySelectorAll('img').forEach((image_path) => {
    image_path.src = path.join(
      '/assets',
      filterPathImage(bookPath, image_path.src),
    );
  });
  document.querySelectorAll('a').forEach((link) => {
    link.href = path.join(
      '/',
      filterPathMd(path.basename(bookPath), link.href),
    );
  });
  const articleList = document.toString();
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

const filterPathImage = (bookPath: string, src: string) => {
  if (/^http/.test(src)) {
    return src;
  } else if (/\.\//.test(src)) {
    return `${bookPath}/${src.substring(2)}`;
  } else {
    return `${bookPath}/${src}`;
  }
};

const filterPathMd = (bookPath: string, src: string) => {
  if (/^http/.test(src)) {
    return src;
  } else if (/\.\/index\.md/.test(src) || src === 'index.md') {
    return `${bookPath}/`;
  } else if (/\.\//.test(src)) {
    return `${bookPath}/${src.slice(2, -3)}/`;
  } else {
    return `${bookPath}/${src.slice(0, -3)}/`;
  }
};

export { getArticleList, getTocMd, getTocContent };
