import { bookToc } from './constants';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import toml from 'toml';
import MarkdownIt from 'markdown-it';
import { DOMParser } from 'linkedom';
import { IndexRaw } from './types';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTableOfContents from 'markdown-it-toc-done-right';

const makeArticleToc = async (
  articlePath: string,
): Promise<[IndexRaw, string]> => {
  const md = new MarkdownIt({
    breaks: true,
    linkify: true,
  });

  md.use(markdownItAnchor, {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: '#',
  });
  md.use(markdownItTableOfContents);
  const domParser = new DOMParser();
  const [meta, content] = await getArticle(articlePath);
  const articleHtml = md.render(content + '${toc}');
  const document = domParser.parseFromString(articleHtml, 'text/html');
  document.querySelectorAll('img').forEach((image_path) => {
    image_path.src = path.join(
      '/assets',
      filterPathImage(articlePath, image_path.src),
    );
  });
  document.querySelectorAll('a').forEach((link) => {
    link.href = filterPathMd(path.basename(articlePath), link.href);
  });
  const articleToc = document.querySelector('.table-of-contents').toString();
  return [meta, articleToc];
};

const getArticle = async (ArticlePath: string): Promise<[IndexRaw, string]> => {
  let fileRaw;
  try {
    fileRaw = fs.readFileSync(ArticlePath, 'utf-8');
  } catch {
    const defaultBook: [IndexRaw, string] = [
      {
        title: 'There is no book',
        date: '2022-01-01T00:00:00+09:00',
        draft: false,
      },
      '',
    ];
    return defaultBook;
  }
  const metadata = getBookMetadata(fileRaw);
  const content = getBookContent(fileRaw);
  return [metadata, content];
};

// str === [book]/index.md's frontmatter
const getBookMetadata = (str: string): IndexRaw => {
  const rawData = matter(str, {
    engines: {
      toml: toml.parse.bind(toml),
    },
    language: 'toml',
    delimiters: '+++',
  });
  return rawData.data as IndexRaw;
};

// str === [book]/index.md's content
const getBookContent = (str: string): string => {
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
  } else if (/^#/.test(src)) {
    return src;
  } else if (/\.\/index\.md/.test(src) || src === 'index.md') {
    return path.join('/', bookPath, '/');
  } else if (/\.\//.test(src)) {
    return path.join('/', bookPath, src.slice(2, -3), '/');
  } else {
    return path.join('/', bookPath, src.slice(0, -3), '/');
  }
};

export { makeArticleToc, getArticle };
