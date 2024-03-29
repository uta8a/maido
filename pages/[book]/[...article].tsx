import { GetStaticPaths, NextPage, GetStaticProps } from 'next';
import React from 'react';
import { ArticleProps } from '../../utils/types';
import path from 'path';
import { documentRoot } from '../../utils/constants';
import { getArticleList } from '../../utils/getArticleList';
import { makeArticleToc } from '../../utils/makeArticleToc';
import { makeArticleContent } from '../../utils/makeArticleContent';
import { isDirectory, searchMd } from '../../utils/searchMd';
import { Article } from '@/components/Article';
import { getProjectTitle } from 'utils/getMetadata';

const BookPage: NextPage<ArticleProps> = (props: ArticleProps) => {
  return (
    <Article
      projectTitle={props.projectTitle}
      meta={props.meta}
      list={props.list}
      content={props.content}
      toc={props.toc}
    />
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const rootPath = path.join(process.cwd(), documentRoot); // 'content'
  const rawPaths = await searchMd(rootPath);
  // paths needs prefix `/`, trim unnecessary prefix and postfix `.md`
  const paths = rawPaths.map((rawPath) => {
    const basePath = rawPath.slice(rootPath.length);
    if (
      basePath.split('/').length > 3 &&
      path.basename(rawPath) === 'index.md'
    ) {
      return rawPath.slice(rootPath.length, -9);
    }
    return rawPath.slice(rootPath.length, -3);
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
  const articleBasePath =
    params !== undefined
      ? Array.isArray(params.article)
        ? path.join(...params.article)
        : ''
      : '';
  const bookPath = path.join(process.cwd(), documentRoot, bookBasePath);
  const articleRawPath = path.join(bookPath, articleBasePath);
  let articlePath;
  if (await isDirectory(articleRawPath)) {
    articlePath = path.join(articleRawPath, 'index.md');
  } else {
    articlePath = articleRawPath + '.md';
  }
  // articlelistの生成(toc.md): Htmlを返す
  const articleList = await getArticleList(bookPath);

  // articleのtoc生成: Htmlを返す
  const articleToc = await makeArticleToc(articlePath);

  // 内容の生成: Htmlを返す
  // この時点でbookのrootはdraft = falseと仮定して良い(getBooks.tsで弾いている)
  const articleContent = await makeArticleContent(articlePath);

  const listHtml = articleList;
  const metadata = articleContent[0];
  const contentHtml = articleContent[1];
  const tocHtml = articleToc[1];

  const projectTitle = getProjectTitle(process.cwd());

  return {
    props: {
      projectTitle: projectTitle,
      meta: metadata,
      list: listHtml,
      content: contentHtml,
      toc: tocHtml,
    },
  };
};

export default BookPage;
