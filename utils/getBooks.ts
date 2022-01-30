import { Book } from './types';
import { documentRoot } from './constants';

const getBooks = (basePath: string): Book[] => {
  return [
    {
      title: 'My Book 1',
      image_path: 'public/favicon.png',
      date: new Date(Date.parse('2022-01-18T05:28:15+09:00')),
    },
  ];
};

export { getBooks };
