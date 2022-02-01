import React, { FunctionComponent } from 'react';

type Props = {
  content: string;
};

const ArticleContent: FunctionComponent<Props> = (props: Props) => {
  return (
    <div
      className="maido-content"
      dangerouslySetInnerHTML={{
        __html: props.content || '<div>No content.</div>',
      }}
    />
  );
};

export { ArticleContent };