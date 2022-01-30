import { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React from 'react';
import { GetStaticProps } from 'next';
import { getProjectTitle } from '../utils/getMetadata';
import { getBooks } from '../utils/getBooks';
import { StringBook } from '../utils/types';

type Props = {
  books: StringBook[];
  projectTitle: string;
};

const Home: NextPage<Props> = (props: Props) => {
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

export const getStaticProps: GetStaticProps<Props> = async () => {
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

export default Home;
