import { getArticleList } from '../../utils/getArticleList';
import path from 'path';

test('listing articles', () => {
  return getArticleList(
    path.join(process.cwd(), 'content', 'testz-index-toc'),
  ).then((data) => {
    expect(data).toContain('"/testz-index-toc/test-article/"');
    expect(data).toContain('"/testz-index-toc/"');
  });
});
