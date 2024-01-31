'use client';
import { useState } from 'react';
import books, { Book, getAllBookTypes, getListBookByType } from '../book';
import TypeBook from './(components)/home/TypeBook';
const HomePage = () => {
  const [listBook, setListBook] = useState<Book[]>(books);
  const [listBookType, setListBookType] = useState(getAllBookTypes(listBook));
  return (
    <div>
      <div className="h-auto w-screen">
        <div className="pt-20">
          {listBookType.map((type) => {
            return (
              <TypeBook
                type={type}
                books={getListBookByType(listBook, type)}
                key={type}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
