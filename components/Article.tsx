import { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { ArticleLayout, ArticleProps } from '../utils/types';
import { ArticleList } from '@/components/ArticleList';
import { ArticleToc } from '@/components/ArticleToc';
import { ArticleContent } from '@/components/ArticleContent';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import Link from 'next/link';
import Image from 'next/image';
import Prism from 'prismjs';

const defaultLayout: ArticleLayout = {
  list_px: 300, // 5: list-resize-handler width
  list_display: 'block',
  toc_px: 300,
  toc_display: 'block',
};

const Right = (): JSX.Element => {
  return <Image src="/right-arrow.svg" alt="toggle" width={30} height={30} />;
};

const Left = (): JSX.Element => {
  return <Image src="/left-arrow.svg" alt="toggle" width={30} height={30} />;
};

const Article: NextPage<ArticleProps> = (props: ArticleProps) => {
  useEffect(() => {
    Prism.highlightAll();
  });
  // layout
  const [layout, setLayout] = useState<ArticleLayout>(defaultLayout);
  const dragList = (_e: DraggableEvent, data: DraggableData) => {
    const { list_px, ...restLayout } = layout;
    setLayout({ list_px: list_px + data.deltaX, ...restLayout });
  };
  const dragToc = (_e: DraggableEvent, data: DraggableData) => {
    const { toc_px, ...restLayout } = layout;
    setLayout({ toc_px: toc_px - data.deltaX, ...restLayout });
  };
  // toggle list, toc
  const [openList, setOpenList] = useState(false);
  const [openToc, setOpenToc] = useState(false);
  useEffect(() => {
    if (openList) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { list_display, ...restLayout } = layout;
      setLayout({ list_display: 'none', ...restLayout });
    }
    if (!openList) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { list_display, ...restLayout } = layout;
      setLayout({ list_display: 'block', ...restLayout });
    }
  }, [openList]);
  useEffect(() => {
    if (openToc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { toc_display, ...restLayout } = layout;
      setLayout({ toc_display: 'none', ...restLayout });
    }
    if (!openToc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { toc_display, ...restLayout } = layout;
      setLayout({ toc_display: 'block', ...restLayout });
    }
  }, [openToc]);

  return (
    <div className="">
      <Head>
        <title>{props.meta.title}</title>
      </Head>

      <main className="">
        <div className="flex">
          <div
            style={{
              width: `${layout.list_px}px`,
              display: layout.list_display,
            }}
            className="h-screen fixed bg-gray-100"
          >
            <ArticleList list={props.list} />
            <Draggable axis="x" onDrag={dragList} bounds={{ left: -100 }}>
              <div
                id="list-resize-handler"
                style={{ cursor: 'move', left: '295px', width: '5px' }}
                className="top-0 bottom-0 h-screen fixed"
              ></div>
            </Draggable>
          </div>
          <div
            style={{
              paddingLeft: `${openList ? 100 : layout.list_px}px`,
              paddingRight: `${openToc ? 100 : layout.toc_px}px`,
            }}
            className="w-full h-screen"
          >
            <div className="w-full relative flex space-x-4 justify-center">
              <div className="pl-2 pt-7 left-0">
                <button
                  className="font-medium"
                  onClick={(_event) => setOpenList(!openList)}
                >
                  {openList ? <Right /> : <Left />}
                </button>
              </div>
              <div className="w-full text-center pt-5">
                <Link href="/">
                  <a>
                    <h1 className="text-3xl underline">{props.projectTitle}</h1>
                  </a>
                </Link>
              </div>
              <div className="pr-2 pt-7 right-0">
                <button
                  className="text-xl"
                  onClick={(_event) => setOpenToc(!openToc)}
                >
                  {openToc ? <Left /> : <Right />}
                </button>
              </div>
            </div>
            <ArticleContent content={props.content} />
          </div>
          <div
            style={{ width: `${layout.toc_px}px`, display: layout.toc_display }}
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

export { Article };
