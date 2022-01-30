import { Book } from './types';
import { documentRoot } from './constants';
import path from 'path';
import fs from 'fs';

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

export { getBooks, walkDir };
