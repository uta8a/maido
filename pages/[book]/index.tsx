import { GetStaticPaths, NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import React from 'react';
import { getProjectTitle } from '../../utils/getMetadata';
import { getBooks, walkDir } from '../../utils/getBooks';
import { IndexRaw } from '../../utils/types';
import { useRouter } from 'next/router';
import path from 'path';
import { documentRoot } from '../../utils/constants';
import { getArticleList } from '../../utils/getArticleList';
import { makeArticleToc } from '../../utils/makeArticleToc';
import { makeArticleContent } from '../../utils/makeArticleContent';

type Props = {
  meta: IndexRaw;
  list: string;
  content: string;
  toc: string;
};

const ArticlePage: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { book } = router.query;
  return (
    <div className={styles.container}>
      <Head>
        <title>{props.meta.title}</title>
      </Head>

      <main className={styles.main}>
        <div
          className="maido-list"
          dangerouslySetInnerHTML={{
            __html: props.list || 'No list.',
          }}
        />
        <div
          className="maido-content"
          dangerouslySetInnerHTML={{
            __html: props.content || 'No content.',
          }}
        />
        <div
          className="maido-toc"
          dangerouslySetInnerHTML={{
            __html: props.toc || 'No toc.',
          }}
        />
      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const rootPath = path.join(process.cwd(), documentRoot); // 'content'
  let paths;
  const rawPaths = await searchMd(rootPath);
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
  const bookBasePath =
    params !== undefined
      ? typeof params.book === 'string'
        ? params.book
        : ''
      : '';
  const bookPath = path.join(process.cwd(), 'content', bookBasePath);
  const articleName = 'index.md';
  // articlelistの生成(toc.md): Htmlを返す
  const articleList = await getArticleList(bookPath);

  // articleのtoc生成: Htmlを返す
  const articleToc = await makeArticleToc(path.join(bookPath, articleName));

  // 内容の生成: Htmlを返す
  // この時点でbookのrootはdraft = falseと仮定して良い(getBooks.tsで弾いている)
  const articleContent = await makeArticleContent(
    path.join(bookPath, articleName),
  );

  const listHtml = articleList;
  const metadata = articleContent[0];
  const contentHtml = articleContent[1];
  const tocHtml = articleToc[1];

  return {
    props: {
      meta: metadata,
      list: listHtml,
      content: contentHtml,
      toc: tocHtml,
    },
  };
};

export default ArticlePage;
