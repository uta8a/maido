import { getBookTitle } from '../../utils/getMetadata';

test('correct book title', () => {
  expect(getBookTitle(process.cwd())).toBe('My Super docs');
});
