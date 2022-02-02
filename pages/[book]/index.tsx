import { GetStaticPaths, NextPage, GetStaticProps } from 'next';
import React from 'react';
import { ArticleProps } from '../../utils/types';
import path from 'path';
import { documentRoot } from '../../utils/constants';
import { getArticleList } from '../../utils/getArticleList';
import { makeArticleToc } from '../../utils/makeArticleToc';
import { makeArticleContent } from '../../utils/makeArticleContent';
import { walkDir } from '../../utils/getBooks';
import { Article } from '@/components/Article';

const ArticlePage: NextPage<ArticleProps> = (props: ArticleProps) => {
  return (
    <Article
      meta={props.meta}
      list={props.list}
      content={props.content}
      toc={props.toc}
    />
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

export const getStaticProps: GetStaticProps<ArticleProps> = async ({
  params,
}) => {
  const bookBasePath =
    params !== undefined
      ? typeof params.book === 'string'
        ? params.book
        : ''
      : '';
  const bookPath = path.join(process.cwd(), documentRoot, bookBasePath);
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
