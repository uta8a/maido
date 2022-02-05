import React from 'react';
import ReactDOM from 'react-dom';
import './style/main.scss';
import { AppPage } from '@/App';
import { HomePage } from './pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import books from 'data/book.json';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/app" element={<AppPage />} />
      <Route
        path="/"
        element={
          <HomePage
            books={books.data}
            projectTitle="title!"
          />
        }
      />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'),
);
