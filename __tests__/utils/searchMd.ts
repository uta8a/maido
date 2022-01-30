import { searchMd, checkMd } from '../../utils/searchMd';
import path from 'path';

test('check if it is Markdown file by file extension', () => {
  expect(checkMd('index.md')).toEqual(true);
});

test('check if it is Markdown file by file extension', () => {
  expect(checkMd('image.png')).toEqual(false);
});

test('check nested book', () => {
  return searchMd(
    path.join(process.cwd(), 'content', 'testz-index-toc-nest'),
  ).then((data) => {
    expect(data).toEqual([
      'test-data.md',
      'index.md',
      'test-article.md',
      'toc.md',
    ]);
  });
});
