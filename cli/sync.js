import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import toml from 'toml';

const sync = () => {
  const rootPath = path.join(process.cwd(), process.env.DOCUMENT_ROOT);
  const availableDirs = await searchAvailableDir(rootPath);
  copyAssets(availableDirs);
};

// content -> public
const copyAssets = (dirs) => {
  for (const dir of dirs) {
    const dirPath = path.dirname(dir);
    try {
      const dirents = await fs.readdirSync(dirPath, { withFileTypes: true });
      for (const dirent of dirents) {
        if (!dirent.isDirectory() && !checkMd(dirent.name)) {
          fs.copyFile(
            path.join(dirPath, dirent.name),
            path.join(process.cwd(), 'public', dirPath, dirent.name),
          );
        }
      }
    } catch {
      // ignore error
    }
  }
};

const searchAvailableDir = async (rootPath) => {
  const mdDirPaths = [];
  try {
    const dirents = await fs.readdirSync(rootPath, { withFileTypes: true });
    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        const mds = await searchAvailableDir(path.join(rootPath, dirent.name));
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

const checkMd = (filepath) => {
  return filepath.slice(-3) === '.md';
};

const checkAvailableMd = async (filepath) => {
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
const getDraft = (str) => {
  const rawData = matter(str, {
    engines: {
      toml: toml.parse.bind(toml),
    },
    language: 'toml',
    delimiters: '+++',
  });
  return rawData.data.draft;
};

sync();
