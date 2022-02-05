import path from 'path';
import fs from 'fs';

const projectData = (projectName) => {
  return `title = "${[projectName]}"
image_path = "./favicon.png"
`;
};

// node project.js [name: string]
const newDir = async () => {
  if (process.argv.length !== 3) {
    console.log('usage: node project.js [name: string]');
    return;
  }
  if (process.env.DOCUMENT_ROOT === undefined) {
    console.log('$DOCUMENT_ROOT is not set');
    return;
  }
  const dirName = process.argv[2];
  const documentRoot = path.join(process.cwd(), process.env.DOCUMENT_ROOT);
  await fs.mkdirSync(documentRoot, { recursive: true });
  await fs.writeFileSync(
    path.join(documentRoot, 'project_settings.toml'),
    projectData(dirName),
  );
};

newDir();
