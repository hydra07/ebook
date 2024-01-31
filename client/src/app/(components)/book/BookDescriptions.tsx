'use client';
import { Book } from '@/book';
import { Breadcrumbs, Button } from '@material-tailwind/react';
// import Rating from './Rating';
import RatingBar from './RatingBar';
export default ({ book }: { book: Book }) => {
  return (
    <div className="">
      <div className="text-white">
        
        <h1 className="text-4xl ">{book.title}</h1>
        <span className="rate flex py-3 ">
          {/* <Rating book={book} /> */}
          <RatingBar />
        </span>
        {/* <BookAuthor book={book} /> */}
      </div>

      <span className="flex flex-row my-8">
        <p className="text-blue-gray-400 basis-1/10 pt-2 "> Loại sách </p>
        <a href="" className="text-white  rounded-lg bg-blue-gray-500 p-2  ">
          {book.types}
        </a>
      </span>
      {/* <ButtonRead book={book} /> */}
      <Button placeholder={null}> Readbook </Button>
      <p className="text-white pt-8 text-md">{book.description}</p>
      {/* <BookComment book={book} /> */}
    </div>
  );
};
