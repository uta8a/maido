import { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React from 'react';
import { GetStaticProps } from 'next';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import toml from 'toml';
import { Article } from '../utils/types';
import getBookTitle from '../utils/getMetadata';

type Props = {
  path: ArticleInfo[];
};

type ArticleInfo = {
  title: string | undefined;
  path: string;
  date: Date;
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <p>{'Top>Page'}</p>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const str = [
    '---toml',
    'title = "TOML"',
    'description = "Front matter"',
    'categories = "front matter toml"',
    '---',
    'This is content',
  ].join('\n');

  const file = matter(str, {
    engines: {
      toml: toml.parse.bind(toml),
    },
  });
  console.log(file);

  // get metadata from book_settings.toml
  const bookTitle = getBookTitle(process.cwd());

  const a =
    params !== undefined
      ? typeof params.article === 'string'
        ? params.article
        : ''
      : '';
  const targetDir = path.join(process.cwd(), 'content', a);
  const dirs = await fs
    .readdirSync(targetDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const paths = [];
  for (const slug of dirs) {
    const article = getArticleBySlug(a, slug);
    paths.push({ title: article.title, path: slug, date: article.date });
  }
  paths.sort((a, b) => {
    return new Date(a.date) < new Date(b.date) ? 1 : -1;
  });
  return { props: { path: paths } };
};

const getArticleBySlug = (article: string, slug: string): Article => {
  // content/:project/article/dir/name/article_name.md
  const fullPath = path.join(
    process.cwd(),
    'content',
    article,
    slug,
    'index.md',
  );
  let fileRaw;
  try {
    fileRaw = fs.readFileSync(fullPath, 'utf8');
  } catch (e) {
    return {} as Article;
  }
  const { data, content } = matter(fileRaw, {
    engines: {
      toml: toml.parse.bind(toml),
    },
  });

  // const fields = ['slug', 'content', 'title', 'type', 'draft', 'date'];
  const initArticle: Article = {
    slug: '',
    content: '',
    title: '',
    type: 'diary',
    draft: false,
    date: new Date(),
  };
  type Ty = keyof Article;
  const fields = Object.keys(initArticle) as Ty[];
  const item: Article = {
    slug: slug,
    date: new Date(),
  };
  fields.forEach((field) => {
    if (field === 'content') {
      item[field] = content;
    }
    if (data[field] !== undefined) {
      item[field] = data[field] as never;
    }
  });
  return item as Article;
};

export default Home;
