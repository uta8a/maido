import path from 'path';
import fs from 'fs';

const newData = (titleName) => {
  const dt = new Date();
  const jdt = new Date(dt.getTime() + 9 * 60 * 60 * 1000);
  const isoStr = jdt.toISOString().split('Z')[0].split('.')[0] + '+09:00';
  return `+++
title = "${titleName}"
date = "${isoStr}"
draft = false
+++
`;
};

// node project.js [name: string]
const newDir = async () => {
  if (process.argv.length !== 4) {
    console.log(
      'usage: node new.js [title: string] [relative file path: string]',
    );
    return;
  }
  if (process.env.DOCUMENT_ROOT === undefined) {
    console.log('$DOCUMENT_ROOT is not set');
    return;
  }
  const titleName = process.argv[2];
  const filePath = process.argv[3];
  const documentRoot = path.join(process.cwd(), process.env.DOCUMENT_ROOT);
  const targetPath = path.join(documentRoot, filePath);
  await fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  if (await fs.existsSync(targetPath)) {
    console.log(`File  is already Exists.\nPath: ${targetPath}`);
  } else {
    await fs.writeFileSync(targetPath, newData(titleName));
    console.log(`New File created!\nPath: ${targetPath}`);
  }
};

newDir();
