import { Book, Index, Toc, IndexRaw } from './types';
import { documentRoot } from './constants';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import toml from 'toml';

const defaultImagePath = 'public/favicon.png';
const defaultDate = new Date(Date.parse('2022-01-01T00:00:00+09:00'));
const bookIndex = 'index.md';
const bookToc = 'toc.md';
const defaultBookList: Book[] = [
  {
    title: 'There is no book',
    image_path: 'public/favicon.png',
    date: defaultDate,
    book_path: '/',
    draft: false,
  },
];

const getBooks = (basePath: string): Promise<Book[]> => {
  const bookRootPath = path.join(basePath, documentRoot); // 'content'
  const bookList: Promise<Book[]> = walkDir(bookRootPath).then((data) => {
    if (data instanceof Error) {
      return defaultBookList;
    }
    const bookFullPaths = data.map((bookFullPath) =>
      path.join(bookRootPath, bookFullPath),
    ); // add prefix
    if (bookFullPaths.length === 0) {
      return defaultBookList;
    }
    const bookList = getBookList(bookFullPaths);
    return bookList;
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
  const bookList: Book[] = [];
  bookPaths.forEach(async (bookPath) => {
    const bookMetadata = await getBookMetadata(bookPath);
    if (!bookMetadata.draft) {
      bookList.push(bookMetadata);
    }
  });
  return bookList;
};

const getBookMetadata = async (bookPath: string): Promise<Book> => {
  const indexPath = path.join(bookPath, bookIndex);
  const tocPath = path.join(bookPath, bookToc);
  let title = path.basename(bookPath);
  let date = defaultDate;
  let image_path = defaultImagePath;
  let draft = false;
  const book_path = path.basename(bookPath);
  if (checkFileExists(indexPath)) {
    const data = await getBookData(title, indexPath);
    title = data.title;
    date = data.date;
    draft = data.draft;
  }
  if (checkFileExists(tocPath)) {
    image_path = await getImagePath(tocPath);
  }
  return { title, date, image_path, book_path, draft };
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

const getBookData = async (
  defaultBookTitle: string,
  indexPath: string,
): Promise<Index> => {
  let fileRaw;
  try {
    fileRaw = fs.readFileSync(indexPath, 'utf-8');
  } catch {
    return { title: defaultBookTitle, date: defaultDate, draft: false };
  }
  const data = getIndexMetadata(fileRaw);
  return {
    title: data.title,
    date: new Date(Date.parse(data.date)),
    draft: data.draft,
  };
};

// str === index.md's content
const getIndexMetadata = (str: string): IndexRaw => {
  const rawData = matter(str, {
    engines: {
      toml: toml.parse.bind(toml),
    },
    language: 'toml',
    delimiters: '+++',
  });
  return rawData.data as IndexRaw;
};

const getImagePath = async (tocPath: string): Promise<string> => {
  let fileRaw;
  try {
    fileRaw = fs.readFileSync(tocPath, 'utf-8');
  } catch {
    return defaultImagePath;
  }
  const metadata = getTocMetadata(fileRaw);
  return metadata.image_path;
};

// str === toc.md's content
const getTocMetadata = (str: string): Toc => {
  const rawData = matter(str, {
    engines: {
      toml: toml.parse.bind(toml),
    },
    language: 'toml',
    delimiters: '+++',
  });
  return rawData.data as Toc;
};

export {
  getBooks,
  walkDir,
  checkFileExists,
  getBookData,
  getIndexMetadata,
  getImagePath,
  getTocMetadata,
  defaultImagePath,
};
