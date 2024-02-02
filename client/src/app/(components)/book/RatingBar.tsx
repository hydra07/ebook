import { Rating, Typography } from '@material-tailwind/react';
import { useState } from 'react';
export default () => {
  const [rated, setRated] = useState(0);
  const [reviewer, setReviewer] = useState(200);
  return (
    <div>
      <div className="flex flex-row items-center gap-2 font-bold text-gray-400">
        <div className=''>
          {rated}.7   
        </div>
        <Rating
          value={4}
          onChange={(value) => setRated(value)}
          placeholder={null}
        />
        <Typography
          color="blue-gray"
          className="font-medium text-gray-400"
          placeholder={null}
          children={`Based on ${reviewer} Reviews`}
        ></Typography>
      </div>
    </div>
  );
};
