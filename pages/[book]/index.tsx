import { GetStaticPaths, NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { ArticleLayout, IndexRaw } from '../../utils/types';
import path from 'path';
import { documentRoot } from '../../utils/constants';
import { getArticleList } from '../../utils/getArticleList';
import { makeArticleToc } from '../../utils/makeArticleToc';
import { makeArticleContent } from '../../utils/makeArticleContent';
import { walkDir } from '../../utils/getBooks';
import { ArticleList } from '@/components/ArticleList';
import { ArticleToc } from '@/components/ArticleToc';
import { ArticleContent } from '@/components/ArticleContent';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

type Props = {
  meta: IndexRaw;
  list: string;
  content: string;
  toc: string;
};

const defaultLayout: ArticleLayout = {
  list_px: 300, // 5: list-resize-handler width
  toc_px: 300,
};

const ArticlePage: NextPage<Props> = (props: Props) => {
  const [layout, setLayout] = useState<ArticleLayout>(defaultLayout);
  const dragList = (e: DraggableEvent, data: DraggableData) => {
    setLayout({ list_px: 300 + data.x, toc_px: layout.toc_px });
  };
  const dragToc = (e: DraggableEvent, data: DraggableData) => {
    setLayout({ list_px: layout.list_px, toc_px: 300 - data.x });
  };
  return (
    <div className="">
      <Head>
        <title>{props.meta.title}</title>
      </Head>

      <main className="">
        <div className="flex">
          <div
            style={{ width: `${layout.list_px}px` }}
            className="h-screen fixed bg-gray-100"
          >
            <ArticleList list={props.list} />
            <Draggable axis="x" onDrag={dragList} bounds={{ left: -100 }}>
              <div
                id="list-resize-handler"
                style={{ cursor: 'move', left: '295px', width: '5px' }}
                className="absolute top-0 bottom-0 h-screen fixed"
              ></div>
            </Draggable>
          </div>
          <div
            style={{
              paddingLeft: `${layout.list_px}px`,
              paddingRight: `${layout.toc_px}px`,
            }}
            className="bg-yellow-100 pr-20 w-full"
          >
            <ArticleContent content={props.content} />
          </div>
          <div
            style={{ width: `${layout.toc_px}px` }}
            className="h-screen fixed bg-gray-100 right-0"
          >
            <ArticleToc toc={props.toc} />
            <Draggable axis="x" onDrag={dragToc} bounds={{ right: 100 }}>
              <div
                id="toc-resize-handler"
                style={{ cursor: 'move', right: '295px', width: '5px' }}
                className="absolute top-0 bottom-0 h-screen fixed"
              ></div>
            </Draggable>
          </div>
        </div>
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
