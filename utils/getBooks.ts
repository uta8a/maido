import { Book, Index, Toc } from './types';
import { documentRoot } from './constants';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import toml from 'toml';

const bookIndex = 'index.md';
const bookToc = 'toc.md';
const defaultBookList: Book[] = [
  {
    title: 'There is no book',
    image_path: 'public/favicon.png',
    date: new Date(Date.parse('2022-01-01T00:00:00+09:00')),
  },
];

const getBooks = (basePath: string): Promise<Book[]> => {
  const bookRootPath = path.join(basePath, documentRoot); // 'content'
  // get book full paths
  const bookList: Promise<Book[]> = walkDir(bookRootPath).then((data) => {
    if (data instanceof Error) {
      return defaultBookList;
    }
    const bookFullPaths = data.map((path) => bookRootPath + path); // add prefix
    if (bookFullPaths.length === 0) {
      return defaultBookList;
    }
    // TODO functionを用いて、type Bookを返す→Promise<Book[]>が返り値になるのでPromiseを返す
    // getBooksがあるので、曖昧さを避けてgetBookはやめてgetBookMetadataにした
    // TODO getBookMetadata と bookList と getBooks, もっといい命名できそう。
    const bookList = getBookList(bookFullPaths);
    return defaultBookList;
  });

  return bookList;
};

const walkDir = async (rootPath: string): Promise<string[] | Error> => {
  let bookDirPaths: string[];
  try {
    bookDirPaths = await fs
      .readdirSync(rootPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  } catch (err) {
    return Error(`Cannot read ${rootPath} :  ${err}`);
  }
  return bookDirPaths;
};

const getBookList = async (bookPaths: string[]): Promise<Book[]> => {
  // bookPaths.length >= 1

  // Check existence of `book-dir/index.md` is not directory
  return new Promise((res, rej) => res(defaultBookList));
};

const getBookMetadata = async (bookPath: string): Promise<Book> => {
  const indexPath = path.join(bookPath, bookIndex);
  const tocPath = path.join(bookPath, bookToc);
  let title = path.basename(bookPath);
  let image_path = 'public/favicon.png';
  if (checkFileExists(indexPath)) {
    title = await getBookTitle(title, indexPath);
  }
  if (checkFileExists(tocPath)) {
  }
  return defaultBookList[0];
};

// Check file existence
// file not found -> false
// directory -> false
// else -> true
const checkFileExists = (filepath: string): boolean => {
  try {
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const getBookTitle = async (
  defaultBookTitle: string,
  indexPath: string,
): Promise<string> => {
  let fileRaw;
  try {
    fileRaw = fs.readFileSync(indexPath, 'utf-8');
  } catch {
    return defaultBookTitle;
  }
  const metadata = getIndexMetadata(fileRaw);
  return metadata.title;
};

// str === index.md's content
const getIndexMetadata = (str: string): Index => {
  const rawData = matter(str, {
    engines: {
      toml: toml.parse.bind(toml),
    },
    language: 'toml',
    delimiters: '+++',
  });
  return rawData.data as Index;
};

export { getBooks, walkDir, checkFileExists, getBookTitle, getIndexMetadata };
