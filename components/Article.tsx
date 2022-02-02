import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import { ArticleLayout, ArticleProps } from '../utils/types';
import { ArticleList } from '@/components/ArticleList';
import { ArticleToc } from '@/components/ArticleToc';
import { ArticleContent } from '@/components/ArticleContent';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

const defaultLayout: ArticleLayout = {
  list_px: 300, // 5: list-resize-handler width
  toc_px: 300,
};

const Article: NextPage<ArticleProps> = (props: ArticleProps) => {
  const [layout, setLayout] = useState<ArticleLayout>(defaultLayout);
  const dragList = (_e: DraggableEvent, data: DraggableData) => {
    setLayout({ list_px: 300 + data.x, toc_px: layout.toc_px });
  };
  const dragToc = (_e: DraggableEvent, data: DraggableData) => {
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
            className="w-full h-screen"
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

export { Article };
