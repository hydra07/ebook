import { Rating, Typography } from '@material-tailwind/react';
import { useState } from 'react';
export default () => {
  const [rated, setRated] = useState(0);
  const [reviewer, setReviewer] = useState(200);
  return (
    <div>
      <div className="flex items-center gap-2 font-bold text-blue-gray-500">
        {rated}.7
        <Rating
          value={4}
          onChange={(value) => setRated(value)}
          placeholder={null}
        />
        <Typography
          color="blue-gray"
          className="font-medium text-blue-gray-500"
          placeholder={null}
          children={`Based on ${reviewer} Reviews`}
        ></Typography>
      </div>
    </div>
  );
};
