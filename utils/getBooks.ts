import { Book } from './types';
import { documentRoot } from './constants';
import path from 'path';
import fs from 'fs';

const getBooks = (basePath: string): Book[] => {
  const bookRootPath = path.join(basePath, documentRoot); // 'content'
  // get book full paths
  const bookPaths = walkDir(bookRootPath);
  if (bookPaths instanceof Error) {
    return [
      {
        title: 'There is no book',
        image_path: 'public/favicon.png',
        date: new Date(Date.parse('2022-01-18T05:28:15+09:00')),
      },
    ];
  }

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
      .map((dirent) => path.join(rootPath, dirent.name));
  } catch (err) {
    return Error(`Cannot read ${rootPath} :  ${err}`);
  }
  return bookDirPaths;
};

export { getBooks, walkDir };
