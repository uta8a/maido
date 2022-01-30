import { GetStaticPaths, NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import React from 'react';
import { getProjectTitle } from '../../utils/getMetadata';
import { getBooks, walkDir } from '../../utils/getBooks';
import { StringBook } from '../../utils/types';
import { useRouter } from 'next/router';
import path from 'path';
import { documentRoot } from '../../utils/constants';

type Props = {
  books: StringBook[];
  projectTitle: string;
};

const BookPage: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { book } = router.query;
  return (
    <div className={styles.container}>
      <Head>
        <title>{props.projectTitle}</title>
      </Head>

      <main className={styles.main}>
        {props.books.map((book) => {
          const date = new Date(Date.parse(book.date));
          return (
            <div key={book.title}>
              <p>{book.title}</p>
              <p>{`${date.getFullYear()} / ${
                date.getMonth() + 1
              } / ${date.getDay()}`}</p>
              <p>{book.image_path}</p>
              <p>{book.book_path}</p>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const rootPath = path.join(process.cwd(), documentRoot); // 'content'
  let paths;
  const rawPaths = await walkDir(rootPath);
  if (rawPaths instanceof Error) {
    paths = ['/'];
    return { paths, fallback: false };
  }
  // paths needs prefix `/`
  paths = rawPaths.map((rawPath) => {
    return path.join('/', rawPath);
  });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const bookPath =
    params !== undefined
      ? typeof params.book === 'string'
        ? params.book
        : ''
      : '';
  // articlelistの生成(toc.md): Markdownを返す
  // const rawArticleList = getArticleList(bookPath);

  // articleのtoc生成: Htmlを返す
  // const articleToc = makeArticleToc(bookPath);

  // 内容の生成: Htmlを返す
  // const articleContent = makeArticleContent(bookPath);

  // get metadata from project_settings.toml
  const projectTitle = getProjectTitle(process.cwd());

  // get book data (title, date, image_path) from dir/index.md or dirname
  const rawBooks = await getBooks(process.cwd());
  const books = rawBooks.map((book) => {
    return {
      title: book.title,
      date: book.date.toISOString(),
      image_path: book.image_path,
      book_path: book.book_path,
    };
  });
  return { props: { books: books, projectTitle: projectTitle } };
};

export default BookPage;
