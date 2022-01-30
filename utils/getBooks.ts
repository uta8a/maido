import { Book } from './types';
import { documentRoot } from './constants';
import path from 'path';
import fs from 'fs';

const getBooks = (basePath: string): Book[] => {
  const bookRootPath = path.join(basePath, documentRoot); // 'content'
  // get book full paths
  let bookFullPaths: string[];
  walkDir(bookRootPath).then((data) => {
    if (data instanceof Error) {
      return [
        {
          title: 'There is no book',
          image_path: 'public/favicon.png',
          date: new Date(Date.parse('2022-01-01T00:00:00+09:00')),
        },
      ];
    }
    bookFullPaths = data.map((path) => bookRootPath + path); // add prefix
  });

  return [
    {
      title: 'My Book 1',
      image_path: 'public/favicon.png',
      date: new Date(Date.parse('2022-01-18T05:28:15+09:00')),
    },
  ];
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
