import { Book } from '@/book';
export default ({ book }: { book: Book }) => {
  return (
    <div className=" pl-8 w-[95%] relative ">
      <img src={book.images[0]} alt="" className=" ml-2xl rounded-2xl" />
    </div>
  );
};
