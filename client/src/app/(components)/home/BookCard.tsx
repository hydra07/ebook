// import { Book } from '@/book';
 import Book from '@/types/book';
import { Tooltip } from '@material-tailwind/react';
import { ReactElement } from 'react';
// import { getStandardizationTitle } from '@/book';
import { getStandardizationTitle } from '@/utils/sort'
import RatingBar from '../book/RatingBar';
export default ({ book }: { book: Book }) => {
  const handleClick = () => {
    // window.location.href = `/bookdetail/${getStandardizationTitle(book)}`;
    window.location.href = `/bookdetail/${book.id}`;
  };
  const details: ReactElement = (
    <div className="w-[600px] h-[320px] relative bg-fixed rounded-lg backdrop-blur-3xl backdrop-filter bg-opacity-90 bg-black ">
      <div className="pt-8 pl-5">
        <div className="flex flex-col">
          <div className="text-white font-bold text-2xl p-3">{book.title}</div>
          <div className='pl-2'>
            <RatingBar />
          </div>
          <div className="text-white text-sm p-2 line-clamp-4">
            {book.description}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[380px]" onClick={handleClick}>
      <div className="inline-block pt-3">
        <Tooltip
          content={details}
          placement="top-end"
          offset={0}
          // interactive={true}
          dismiss={{
            onClick: () => console.log('dismiss clicked'),
            label: 'Dismiss',
          }}
          // visible={isHovered}
          className="bg-transparent rounded-lg"
        >
          <div className="w-[200px] h-[300px]">
            <img
              className="object-cover rounded-md"
              src={book.imageUrl as string}
              alt={book.title}
            />
          </div>
        </Tooltip>
        <div className="text-white text-md pt-3">{book.title}</div>
      </div>
    </div>
  );
};
