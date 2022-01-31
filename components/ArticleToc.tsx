import React, { FunctionComponent } from 'react';

type Props = {
  toc: string;
};

const ArticleToc: FunctionComponent<Props> = (props: Props) => {
  return (
    <div
      className="maido-toc"
      dangerouslySetInnerHTML={{
        __html: props.toc || 'No toc.',
      }}
    />
  );
};

export { ArticleToc };
