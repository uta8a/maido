import { Book, Index, Toc, IndexRaw } from './types';
import { documentRoot, bookToc } from './constants';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import toml from 'toml';

const searchMd = async (rootPath: string): Promise<string[]> => {
  const mdDirPaths: string[] = [];
  try {
    const dirents = await fs.readdirSync(rootPath, { withFileTypes: true });
    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        const mds = await searchMd(dirent.name);
        mdDirPaths.concat(mds);
      } else {
        if (checkMd(dirent.name)) {
          mdDirPaths.push(dirent.name);
        }
      }
    }
  } catch {
    return [];
  }
  return mdDirPaths;
};

const checkMd = (filepath: string): boolean => {
  return filepath.slice(-3) === '.md';
};

export { searchMd, checkMd };
