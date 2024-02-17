import BookDescriptions from '@/app/(components)/book/BookDescriptions';
import BookImage from '@/app/(components)/book/BookImage';
import Breadcrumbs from '@/app/(components)/book/Breadcrumbs';
// import books, { Book, getBookById, getBookByStandardizationTitle } from '@/book';
import axios from '@/lib/axios';
// import { Breadcrumbs } from '@material-tailwind/react';
export default async ({ params }: { params: { id: number } }) => {
  const res = await axios.post(`/book/find/${params.id}`);
  const book = await res.data;
  console.log(book);
  if (!book) {
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
    </div>
  );
};
