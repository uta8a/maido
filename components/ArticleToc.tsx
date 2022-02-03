import React, { FunctionComponent } from 'react';

type Props = {
  toc: string;
};

const ArticleToc: FunctionComponent<Props> = (props: Props) => {
  return (
    <div
      className="maido-toc pt-5 pl-3"
      dangerouslySetInnerHTML={{
        __html: props.toc || '<div>No toc.</div>',
      }}
    />
  );
};

export { ArticleToc };
