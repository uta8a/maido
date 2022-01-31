import React, { FunctionComponent } from 'react';

type Props = {
  title: string;
  date: string;
  linkPath: string;
  // future
  // imagePath: string;
};

const BookCard: FunctionComponent<Props> = (props: Props) => {
  return (
    <a className="my-3" href={props.linkPath} aria-label={props.title}>
      <div className="w-full h-32 flex flex-col justify-between dark:bg-gray-800 bg-white hover:bg-yellow-100 dark:border-gray-700 rounded-lg border border-gray-400 py-5 px-4">
        <div>
          <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-3">
            {props.title}
          </h4>
        </div>
        <div>
          <div className="flex items-center justify-between text-gray-800 dark:text-gray-100">
            <p className="text-sm">{props.date}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export { BookCard };
