import React from 'react';
import ReactDOM from 'react-dom';
import './style/main.scss';
import { AppPage } from '@/App';
import { HomePage } from './pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/app" element={<AppPage />} />
      <Route
        path="/"
        element={
          <HomePage
            books={[
              {
                title: 'book!',
                image_path: '/',
                date: '2022-01-18T05:28:15+09:00',
                book_path: '/',
              },
            ]}
            projectTitle="title!"
          />
        }
      />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'),
);
