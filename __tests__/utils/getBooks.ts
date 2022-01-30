import { getBooks } from '../../utils/getBooks';
import { Book } from '../../utils/types';
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
