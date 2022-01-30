import { searchMd, checkMd } from '../../utils/searchMd';
import path from 'path';

test('check if it is Markdown file by file extension', () => {
  expect(checkMd('index.md')).toEqual(true);
});

test('check if it is Markdown file by file extension', () => {
  expect(checkMd('image.png')).toEqual(false);
});
