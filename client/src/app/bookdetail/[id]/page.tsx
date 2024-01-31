'use client';
import BookDescriptions from '@/app/(components)/book/BookDescriptions';
import BookImage from '@/app/(components)/book/BookImage';
import books, { Book, getBookById } from '@/book';
import { Breadcrumbs } from '@material-tailwind/react';
export default ({ params }: { params: { id: number } }) => {
  const book: Book | undefined = getBookById(books, params.id);

  if (!book) {
    // Handle the case where no book was found, perhaps by returning an error message or a 404 page
    return <div>Book not found</div>;
  }
  return (
    <div className="pt-20">
      {/* <BookLink book={book} /> */}
      <div className="pl-14">
        <Breadcrumbs placeholder={null} className="bg-none">
          <a href="#" className="opacity-60">
            Docs
          </a>
          <a href="#" className="opacity-60">
            Components
          </a>
          <a href="#">Breadcrumbs</a>
        </Breadcrumbs>
      </div>
      <div className="flex flex-row p-5">
        <div className="basis-1/3">
          <BookImage book={book} />
        </div>
        <div className=" pl-4 basis-2/3">
          <BookDescriptions book={book} />
        </div>
      </div>
      <div className="carousel"></div>
    </div>
  );
};
