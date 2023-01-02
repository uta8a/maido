import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { GetStaticProps } from 'next';
import { getProjectTitle } from '../utils/getMetadata';
import { getBooks } from '../utils/getBooks';
import { StringBook } from '../utils/types';
import path from 'path';
import { BookCard } from '../components/BookCard';
import Link from 'next/link';

type Props = {
  books: StringBook[];
  projectTitle: string;
};

const Home: NextPage<Props> = (props: Props) => {
  return (
    <div>
      <Head>
        <title>{props.projectTitle}</title>
      </Head>

      <main>
        {/* Header */}
        <div className="mx-auto max-w-7xl py-10 px-10 grid place-items-center">
          <Link href="/" className="inline-block font-thin text-3xl text-center m-0 whitespace-no-wrap overflow-hidden">
            {props.projectTitle}
          </Link>
        </div>
        {/* ContentWrapper */}
        <div className="mx-auto max-w-7xl px-10">
          <div className="grid place-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {props.books.map((book) => {
              const rawDate = new Date(Date.parse(book.date));
              const date = `${rawDate.getFullYear()} / ${
                rawDate.getMonth() + 1
              } / ${rawDate.getDay()}`;
              return (
                <BookCard
                  key={book.book_path}
                  title={book.title}
                  date={date}
                  linkPath={book.book_path}
                />
              );
            })}
          </div>
        </div>
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
      book_path: path.join('/', book.book_path),
    };
  });
  return { props: { books: books, projectTitle: projectTitle } };
};

export default Home;
