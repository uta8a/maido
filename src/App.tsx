import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { BookCard } from '@/components/BookCard';

const AppPage: FunctionComponent = () => {
  return <Link to="/expenses">Expenses</Link>;
};
export { AppPage };
