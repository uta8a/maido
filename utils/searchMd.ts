import path from 'path';
import fs from 'fs';
import { IndexRaw } from './types';
import matter from 'gray-matter';
import toml from 'toml';

const searchMd = async (rootPath: string): Promise<string[]> => {
  const mdDirPaths: string[] = [];
  try {
    const dirents = await fs.readdirSync(rootPath, { withFileTypes: true });
    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        const mds = await searchMd(path.join(rootPath, dirent.name));
        mdDirPaths.push(...mds);
      } else {
        if (checkMd(dirent.name)) {
          const fullPath = path.join(rootPath, dirent.name);
          const available = await checkAvailableMd(fullPath);
          if (!available) {
            mdDirPaths.push(fullPath);
          }
        }
      }
    }
  } catch {
    // ignore error
  }
  return mdDirPaths;
};

const checkMd = (filepath: string): boolean => {
  return filepath.slice(-3) === '.md';
};

const checkAvailableMd = async (filepath: string): Promise<boolean> => {
  let fileRaw;
  try {
    fileRaw = fs.readFileSync(filepath, 'utf-8');
  } catch {
    return false;
  }
  const data = getDraft(fileRaw);
  return data;
};

// str === [book]/[...article].md's content
const getDraft = (str: string): boolean => {
  const rawData = matter(str, {
    engines: {
      toml: toml.parse.bind(toml),
    },
    language: 'toml',
    delimiters: '+++',
  });
  return rawData.data.draft;
};

export { searchMd, checkMd };
