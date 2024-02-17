// eslint-disable-next-line react/display-name
// import {User} from "next-auth";
// "use client";
import User from '@/types/user';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { useCallback } from 'react';
// eslint-disable-next-line react/display-name
export default ({
  isEditUser,
  setIsEditUser,
  user,
}: {
  isEditUser: boolean;
  setIsEditUser: any;
  user: User;
}) => {
  const handleEditClick = useCallback(() => {
    setIsEditUser(true);
  }, []);
  return (
    <div className="backdrop-blur-3xl bg-white/5 p-4 rounded shadow w-3/5 h-5/6 flex flex-col relative">
      <div className="flex justify-center -mt-12">
        <img
          // src={`data:image/png;base64,${user?.avatar}`}
          src={
            user?.image
              ? user.image
              : `https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg`
          }
          alt="User avatar"
          className="w-24 h-24 rounded-full mb-4 content-center shadow-md"
        />
      </div>
      <div className="text-center mt-2 mb-5 justify-center">
        <div className="flex flex-row space-x-4 justify-center">
          <h1 className="text-2xl font-semibold mb-2" id="name">
            {user?.name}
          </h1>
          <Image
            className="pb-1"
            src={user?.gender == true ? '/svg/male.svg' : 'svg/female.svg'}
            alt=""
            width={20}
            height={20}
          />
        </div>
        <p className="text-lg font-bold mb-2">{user?.email}</p>
      </div>
      <div className="justify-center self-center">
        <h1 className="text-2xl font-semibold mb-2" id="phone">
          {user?.phone}
        </h1>
      </div>
      <div>
        <h1 className="text-2xl font-semibold mb-2" id="gender">
          {user?.gender}
        </h1>
      </div>

      {/*
            <div className="text-gray-600 justify-between text-lg ">
              <p>
                <span className="font-medium">Username:</span> {user?.username}
              </p>
              <p>
                <span className="font-medium">Phone: </span> {user?.phone}
              </p>
              <p>
                <span className="font-medium">Birthday: </span> {user?.birthday}
              </p>
              <p>
                <span className="font-medium">Address: </span> {user?.address}
              </p>
            </div>
            */}
      <div className="mt-auto flex justify-center">
        {/* <Button
          className="text-white rounded w-1/3 content-center"
          onClick={async () => {
            await getSession();
          }}
          placeholder={null}
        >
          FETCH LẠI
        </Button> */}
        <Button
          className="text-white rounded w-1/3 content-center"
          onClick={handleEditClick}
          placeholder={null}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};
