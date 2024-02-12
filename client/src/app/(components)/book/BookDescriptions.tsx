'use client'
import Book from '@/types/book';
import { Button } from '@material-tailwind/react';
import RatingBar from './RatingBar';
import BookAuthor from './BookAuthor';
export default ({ book }: { book: Book }) => {
  return (
    <div className="">
      <div className="text-white">
        <h1 className="text-4xl ">{book.title}</h1>
        <BookAuthor book={book} />
        <span className="rate flex py-3 ">
          <RatingBar book={book} />
        </span>


       
      </div>
      <span className="flex flex-row my-8 space-x-2">
        <p className="text-white basis-1/10 pt-2 "> Loại sách </p>
          <div className='flex flex-row space-x-3 whitespace-nowrap'>
            { book.types!.map((type) => (
                <a href="" className="p-2 text-white  rounded-lg bg-blue-gray-500 hover:bg-blue-gray-800">{type.name}</a>
              ))}
          </div>    
      </span>
      {/* <ButtonRead book={book} /> */}
      <Button placeholder={null}> Read </Button>
      <p className="text-white pt-8 text-md">{book.description}</p>
      {/* <BookComment book={book} /> */}
    </div>
  );
};
