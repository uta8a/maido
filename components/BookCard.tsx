import React, { FunctionComponent } from 'react';

type Props = {
  title: string;
  date: string;
  linkPath: string;
};

const BookCard: FunctionComponent<Props> = (props: Props) => {
  return (
    <a
      className="mb-4 hover:shadow"
      href={props.linkPath}
      aria-label={props.title}
    >
      <div className="flex mb-4 items-center border border-gray-200 rounded p-4">
        <div>
          <h4 className="text-lg font-bold mb-3 tracking-tight text-gray-900">
            {props.title}
          </h4>
          <p className="text-lg font-bold mb-3 tracking-tight text-gray-900">
            {props.date}
          </p>
        </div>
      </div>
    </a>
  );
};

export { BookCard };
