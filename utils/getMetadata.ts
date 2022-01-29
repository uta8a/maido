import path from 'path';
import fs from 'fs';
import toml from 'toml';

const documentRoot: string = 'content';
const settingFilename: string = 'book_settings.toml';
const defaultBookTitle: string = 'My Awesome TechBlog';

// fullpathを得る、fileIO、file readの3つに分割できて、IO以外はテストが簡単なので外部関数に分割してもいいかも
const getBookTitle = (basePath: string): string => {
  const fullPath = path.join(basePath, documentRoot, settingFilename);
  let fileRaw;
  try {
    fileRaw = fs.readFileSync(fullPath, 'utf8');
  } catch (e) {
    return defaultBookTitle;
  }
  const data = toml.parse(fileRaw); // TODO: ここtypeつけたい
  return data.title;
};

export { getBookTitle };
