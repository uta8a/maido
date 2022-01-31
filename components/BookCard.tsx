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
    <a className="" href={props.linkPath} aria-label={props.title}>
      <div className="w-full h-32 flex flex-col justify-between dark:bg-gray-800 bg-white dark:border-gray-700 rounded-lg border border-gray-400 mb-6 py-5 px-4">
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
