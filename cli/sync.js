import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import toml from 'toml';

const sync = async () => {
  const rootPath = path.join(process.cwd(), process.env.DOCUMENT_ROOT);
  const availableDirs = await searchAvailableDir(rootPath);
  copyAssets(rootPath, availableDirs);
};

// content -> public
const copyAssets = async (rootPath, dirs) => {
  for (const dir of dirs) {
    const dirPath = path.dirname(dir);
    try {
      const dirents = await fs.readdirSync(dirPath, { withFileTypes: true });
      await fs.mkdirSync(path.join(process.cwd(), '../public', dirPath.slice(rootPath.length)), { recursive: true });
      for (const dirent of dirents) {
        if (!dirent.isDirectory() && !checkMd(dirent.name)) {
          const srcPath = path.join(dirPath, dirent.name);
          const destPath = path.join(process.cwd(), '../public', dirPath.slice(rootPath.length), dirent.name);
          fs.copyFile(
            srcPath,
            destPath,
            (err) => {
              // ignore error
            },
          );
          console.log(srcPath);
          console.log(destPath);
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
