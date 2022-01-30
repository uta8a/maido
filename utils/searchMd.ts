import path from 'path';
import fs from 'fs';

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
          mdDirPaths.push(dirent.name);
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

export { searchMd, checkMd };
