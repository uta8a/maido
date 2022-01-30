import { makeArticleToc, getArticle } from '../../utils/makeArticleToc';
import path from 'path';
import { IndexRaw } from '../../utils/types';

const meta: IndexRaw = {
  title: 'With Toc TechNote',
  date: '2022-01-18T05:28:15+09:00',
  draft: false,
};
const contentMd = `
# index.md

Hello

# My TechNote 1

これは技術文書置き場です。

## h2 test

これはどうでしょうか
`;

test('make article toc', () => {
  return makeArticleToc(
    path.join(process.cwd(), 'content', 'testz-index-toc', 'index.md'),
  ).then((data) => {
    expect(data[0]).toEqual(meta);
    expect(data[1]).toBe(
      '<nav class="table-of-contents"><ol><li><a href="#index.md"> index.md</a></li><li><a href="#my-technote-1"> My TechNote 1</a><ol><li><a href="#h2-test"> h2 test</a></li></ol></li></ol></nav>',
    );
  });
});

test('get article content', () => {
  return getArticle(
    path.join(process.cwd(), 'content', 'testz-index-toc', 'index.md'),
  ).then((data) => {
    expect(data[0]).toEqual(meta);
    expect(data[1]).toBe(contentMd);
  });
});
