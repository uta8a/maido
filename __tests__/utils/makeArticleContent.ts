import { makeArticleContent } from '../../utils/makeArticleContent';
import path from 'path';
import { IndexRaw } from '../../utils/types';

const meta: IndexRaw = {
  title: 'With Toc TechNote',
  date: '2022-01-18T05:28:15+09:00',
  draft: false,
};

test('make article content', () => {
  return makeArticleContent(
    path.join(process.cwd(), 'content', 'testz-index-toc', 'index.md'),
  ).then((data) => {
    expect(data[0]).toEqual(meta);
    expect(data[1])
      .toBe(`<h1 id="index.md" tabindex="-1"><a class="header-anchor" href="#index.md">#</a> index.md</h1>
<p>Hello</p>
<h1 id="my-technote-1" tabindex="-1"><a class="header-anchor" href="#my-technote-1">#</a> My TechNote 1</h1>
<p>これは技術文書置き場です。</p>
<h2 id="h2-test" tabindex="-1"><a class="header-anchor" href="#h2-test">#</a> h2 test</h2>
<p>これはどうでしょうか</p>
`);
  });
});
