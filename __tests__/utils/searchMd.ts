import { searchMd, checkMd } from '../../utils/searchMd';
import path from 'path';

test('check if it is Markdown file by file extension', () => {
  expect(checkMd('index.md')).toEqual(true);
});

test('check if it is Markdown file by file extension', () => {
  expect(checkMd('image.png')).toEqual(false);
});

test('check nested book', () => {
  const rootPath = path.join(process.cwd(), 'content', 'testz-index-toc-nest');
  return searchMd(rootPath).then((data) => {
    expect(data).toEqual(
      [
        'a/b/c/test-data.md',
        'dir-index/index.md',
        'index.md',
        'real-test.md',
        'test-article.md',
        'toc.md',
      ].map((data) => path.join(rootPath, data)),
    );
  });
});
