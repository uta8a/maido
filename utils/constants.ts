const documentRoot =
  process.env.DOCUMENT_ROOT !== undefined
    ? process.env.DOCUMENT_ROOT
    : 'content';
const bookToc = 'toc.md';

export { documentRoot, bookToc };
