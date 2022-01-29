import { getBookTitle } from '../../utils/getMetadata';

test('get book title from setting file', () => {
  expect(getBookTitle(process.cwd())).toBe('My Super docs');
});
