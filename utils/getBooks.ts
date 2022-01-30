import { Book, Index, Toc, IndexRaw, IndexPartial } from './types';
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
  },
];

const getBooks = (basePath: string): Promise<Book[]> => {
  const bookRootPath = path.join(basePath, documentRoot); // 'content'
  // get book full paths
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
    // TODO functionを用いて、type Bookを返す→Promise<Book[]>が返り値になるのでPromiseを返す
    // getBooksがあるので、曖昧さを避けてgetBookはやめてgetBookMetadataにした
    // TODO getBookMetadata と bookList と getBooks, もっといい命名できそう。
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
    bookList.push(bookMetadata);
  });
  // Check existence of `book-dir/index.md` is not directory
  return bookList;
};

const getBookMetadata = async (bookPath: string): Promise<Book> => {
  const indexPath = path.join(bookPath, bookIndex);
  const tocPath = path.join(bookPath, bookToc);
  let title = path.basename(bookPath);
  let date = defaultDate;
  let image_path = defaultImagePath;
  if (checkFileExists(indexPath)) {
    const data = await getBookData(title, indexPath);
    title = data.title;
    date = data.date;
  }
  if (checkFileExists(tocPath)) {
    image_path = await getImagePath(tocPath);
  }
  return { title, date, image_path };
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
): Promise<IndexPartial> => {
  let fileRaw;
  try {
    fileRaw = fs.readFileSync(indexPath, 'utf-8');
  } catch {
    return { title: defaultBookTitle, date: defaultDate };
  }
  const data = getIndexMetadata(fileRaw);
  return { title: data.title, date: new Date(Date.parse(data.date)) };
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
  const data = {
    title: rawData.data.title,
    date: rawData.data.date,
  };
  return data;
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
