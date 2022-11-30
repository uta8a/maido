import React, { FunctionComponent } from 'react';

type Props = {
  content: string;
};

const ArticleContent: FunctionComponent<Props> = (props: Props) => {
  return (
    <>
      <div
        className="maido-content px-5 pb-20"
        dangerouslySetInnerHTML={{
          __html: props.content || '<div>No content.</div>',
        }}
      />
    </>
  );
};

export { ArticleContent };
