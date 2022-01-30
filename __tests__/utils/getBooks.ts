import { getBooks, walkDir } from '../../utils/getBooks';
import { Book } from '../../utils/types';
import path from 'path';

test('get book (title, image_path, date)', () => {
  const books: Book[] = [
    {
      title: 'My Book 1',
      image_path: 'public/favicon.png',
      date: new Date(Date.parse('2022-01-18T05:28:15+09:00')),
    },
  ];
  expect(getBooks(process.cwd())).toStrictEqual(books);
});

test('listing "content/" directory', () => {
  const bookRootPath = path.join(process.cwd(), 'content');
  expect(walkDir(bookRootPath)).toBe([
    'testz',
    'testz-index',
    'testz-index-toc',
  ]);
});

test(`listing directory which doesn't exist`, () => {
  const bookRootPath = path.join(process.cwd(), 'no_directory');
  expect(walkDir(bookRootPath)).toBe(new Error());
});
