import path from 'path';
import fs from 'fs';
import toml from 'toml';
import { documentRoot } from './constants';

const settingFilename = 'project_settings.toml';
const defaultProjectTitle = 'My TechBlog';

// fullpathを得る、fileIO、file readの3つに分割できて、IO以外はテストが簡単なので外部関数に分割してもいいかも
const getProjectTitle = (basePath: string): string => {
  const fullPath = path.join(basePath, documentRoot, settingFilename);
  let fileRaw;
  try {
    fileRaw = fs.readFileSync(fullPath, 'utf8');
  } catch {
    return defaultProjectTitle;
  }
  const data = toml.parse(fileRaw); // TODO: ここtypeつけたい
  return data.title;
};

export { getProjectTitle };
