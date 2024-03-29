import {
  getBooks,
  walkDir,
  checkFileExists,
  getBookData,
  getIndexMetadata,
  getImagePath,
  getTocMetadata,
} from '../../utils/getBooks';
import { Book } from '../../utils/types';
import path from 'path';

test('get book (title, image_path, date)', () => {
  const books: Book[] = [
    {
      title: 'testz',
      image_path: 'public/favicon.png',
      date: new Date(Date.parse('2022-01-01T00:00:00+09:00')),
      book_path: 'testz',
      draft: false,
    },
    {
      title: 'My Super Book',
      image_path: 'public/favicon.png',
      date: new Date(Date.parse('2022-01-18T05:28:15+09:00')),
      book_path: 'testz-index',
      draft: false,
    },
    {
      title: 'With Toc TechNote',
      image_path: './thumbnail.png',
      date: new Date(Date.parse('2022-01-18T05:28:15+09:00')),
      book_path: 'testz-index-toc',
      draft: false,
    },
    {
      title: 'Nest TechNote',
      image_path: './thumbnail-nest.png',
      date: new Date(Date.parse('2022-01-18T05:28:15+09:00')),
      book_path: 'testz-index-toc-nest',
      draft: false,
    },
  ];
  return getBooks(process.cwd()).then((data) => {
    expect(data).toEqual(books);
  });
});

test('get book which is not exist', () => {
  const books: Book[] = [
    {
      title: 'There is no book',
      image_path: 'public/favicon.png',
      date: new Date(Date.parse('2022-01-01T00:00:00+09:00')),
      book_path: '/',
      draft: false,
    },
  ];
  const notExistPath = path.join(process.cwd(), 'no_directory');
  return getBooks(notExistPath).then((data) => {
    expect(data).toEqual(books);
  });
});

test('listing "content/" directory', () => {
  const bookRootPath = path.join(process.cwd(), 'content');
  return walkDir(bookRootPath).then((data) => {
    expect(data).toEqual([
      'testz',
      'testz-index',
      'testz-index-toc',
      'testz-index-toc-ignored',
      'testz-index-toc-nest',
    ]);
  });
});

test('listing directory which does not exist', () => {
  const bookRootPath = path.join(process.cwd(), 'no_directory');
  return walkDir(bookRootPath).then((data) => {
    // objectをstringとして見たときにErrorが含まれていればOK
    // Errorの特定まではしてない
    expect(`${data}`).toMatch('Error');
  });
});

test('check file exists when it is file', () => {
  expect(
    checkFileExists(
      path.join(process.cwd(), 'content', 'project_settings.toml'),
    ),
  ).toEqual(true);
});

test('check file exists when it is directory', () => {
  expect(checkFileExists(path.join(process.cwd(), 'content'))).toEqual(false);
});

test('check file exists when it is not file nor directory', () => {
  expect(checkFileExists(path.join(process.cwd(), 'no_directory'))).toEqual(
    false,
  );
});

test('book-dir/index.md does not exists', () => {
  const defaultBookTitle = 'There is no book';
  const indexPath = path.join(process.cwd(), 'content', 'testz', 'index.md');
  return getBookData(defaultBookTitle, indexPath).then((data) => {
    expect(data.title).toEqual('There is no book');
  });
});

test('book-dir/index.md exists', () => {
  const defaultBookTitle = 'There is no book';
  const indexPath = path.join(
    process.cwd(),
    'content',
    'testz-index',
    'index.md',
  );
  return getBookData(defaultBookTitle, indexPath).then((data) => {
    expect(data.title).toEqual('My Super Book');
  });
});

test('frontmatter', () => {
  const str = `+++
title = "index.md"
date = "2022-01-18T05:28:15+09:00"
draft = false
+++

# index.md

Hello`;
  expect(getIndexMetadata(str).title).toEqual('index.md');
});

test('book-dir/toc.md does not exists', () => {
  const tocPath = path.join(process.cwd(), 'content', 'testz', 'toc.md');
  return getImagePath(tocPath).then((data) => {
    expect(data).toEqual('public/favicon.png');
  });
});

test('book-dir/toc.md exists', () => {
  const tocPath = path.join(
    process.cwd(),
    'content',
    'testz-index-toc',
    'toc.md',
  );
  return getImagePath(tocPath).then((data) => {
    expect(data).toEqual('./thumbnail.png');
  });
});

test('frontmatter', () => {
  const str = `+++
image_path = "./thumbnail.png"
+++

- [index.md](./index.md)
  - [置き場](./test-article.md)`;
  expect(getTocMetadata(str).image_path).toEqual('./thumbnail.png');
});
