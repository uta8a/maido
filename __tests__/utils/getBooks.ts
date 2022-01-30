import {
  getBooks,
  walkDir,
  checkFileExists,
  getBookTitle,
  getIndexMetadata,
} from '../../utils/getBooks';
import { Book } from '../../utils/types';
import path from 'path';

test('get book (title, image_path, date)', () => {
  const books: Book[] = [
    {
      title: 'There is no book',
      image_path: 'public/favicon.png',
      date: new Date(Date.parse('2022-01-01T00:00:00+09:00')),
    },
  ];
  return getBooks(process.cwd()).then((data) => {
    expect(data).toStrictEqual(books);
  });
});

test('listing "content/" directory', () => {
  const bookRootPath = path.join(process.cwd(), 'content');
  return walkDir(bookRootPath).then((data) => {
    expect(data).toEqual(['testz', 'testz-index', 'testz-index-toc']);
  });
});

test(`listing directory which doesn't exist`, () => {
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

test(`check file exists when it isn't file nor directory`, () => {
  expect(checkFileExists(path.join(process.cwd(), 'no_directory'))).toEqual(
    false,
  );
});

test(`book-dir/index.md doesn't exists`, () => {
  const defaultBookTitle = 'There is no book';
  const indexPath = path.join(process.cwd(), 'content', 'testz', 'index.md');
  return getBookTitle(defaultBookTitle, indexPath).then((data) => {
    expect(data).toEqual('There is no book');
  });
});

test(`book-dir/index.md exists`, () => {
  const defaultBookTitle = 'There is no book';
  const indexPath = path.join(
    process.cwd(),
    'content',
    'testz-index',
    'index.md',
  );
  return getBookTitle(defaultBookTitle, indexPath).then((data) => {
    expect(data).toEqual('My Super Book');
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
