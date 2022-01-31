import React, { FunctionComponent } from 'react';

type Props = {
  list: string;
};

const ArticleList: FunctionComponent<Props> = (props: Props) => {
  return (
    <div
      className="maido-list"
      dangerouslySetInnerHTML={{
        __html: props.list || '<div>No list.</div>',
      }}
    />
  );
};

export { ArticleList };
