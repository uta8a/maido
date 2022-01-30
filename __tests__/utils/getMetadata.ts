import { getProjectTitle } from '../../utils/getMetadata';

test('get project title from setting file', () => {
  expect(getProjectTitle(process.cwd())).toBe('My Super Books');
});

test('set default project title when no setting file', () => {
  // './no_directory' doesn't exist.
  // set defaultProjectTitle = 'My TechBlog'
  expect(getProjectTitle('./no_directory')).toBe('My TechBlog');
});
