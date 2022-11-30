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
      <style>
        {`
          .maido-content table {
            border-collapse: collapse;
            border: solid 2px black;
          }
          .maido-content table th, td {
            border: solid 1px black;
          }
          .maido-content table tr:nth-child(2n) {
            background-color: #ddd;
          }
        `}
      </style>
    </>
  );
};

export { ArticleContent };
