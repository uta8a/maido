import { bookToc } from './constants';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import toml from 'toml';
import MarkdownIt from 'markdown-it';
import { DOMParser } from 'linkedom';

const makeArticleToc = async (
  bookPath: string,
  articleName: string,
): Promise<string> => {
  const md = new MarkdownIt();
  const domParser = new DOMParser();
};

export { makeArticleToc };
