import { getProjectTitle } from '../../utils/getMetadata';

test('get project title from setting file', () => {
  expect(getProjectTitle(process.cwd())).toBe('My Super docs');
});
