'use client';
import BookDescriptions from '@/app/(components)/book/BookDescriptions';
import BookImage from '@/app/(components)/book/BookImage';
import Breadcrumbs from '@/app/(components)/book/Breadcrumbs';
import books, { Book, getBookById, getBookByStandardizationTitle } from '@/book';
// import { Breadcrumbs } from '@material-tailwind/react';
export default ({ params }: { params: { title: string } }) => {
  // const book: Book | undefined = getBookById(books, params.id);
  const book: Book | null = getBookByStandardizationTitle(params.title, books);
  if (!book) {
    // Handle the case where no book was found, perhaps by returning an error message or a 404 page
    return <div>Book not found</div>;
  }
  return (
    <div className="pt-20">
      <Breadcrumbs book={book} />
      
      <div className="flex flex-row p-5">
        <div className="basis-1/3">
          <BookImage book={book} />
        </div>
        <div className=" pl-4 basis-2/3">
          <BookDescriptions book={book} />
        </div>
      </div>
      {/*<div className="carousel"></div>*/}
    </div>
  );
};
