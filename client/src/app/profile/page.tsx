'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import Loading from '../(components)/Loading';
import ErrorHandle from '../(components)/ErrorHandle';

type User = {
  id: number,
  name: string,
  email: string,
  image: string,
  gender: boolean,
}

export default () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>();
  const [isEditUser, setIsEditUser] = useState(false);

  const handleEditClick = useCallback(() => {
    setIsEditUser(true);
  }, []);
  
  useEffect(() => {
    const setInforUser = async () => {
      const _user: User = {
        id: session?.user.id as number,
        name: session?.user.name as string,
        email: session?.user.email as string,
        image: session?.user.image as string,
        gender: session?.user.gender as boolean,
      }
      if (_user != undefined) {
        setUser(_user);
        console.log(user);
      }
    }
    setInforUser();
    
  }, [session?.user])

  if (status === "loading") {
    return (
      <div className='w-full h-full'>
        <Loading />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <ErrorHandle message='Không có quyền truy cập!!' />
      </div>
    )
  }
  return (
    <div className="p-10">
      {/*Dang nhap thanh cong
      <div>{`ma token la ${session?.user.accessToken}`}</div>
      <div>{session?.user.id}</div>
      <div>{session?.user.name}</div>
      <div>{session?.user.email}</div>
      <div>{session?.user.image}</div>*/}

      <div className='flex flex-col items-center h-screen'>
        <h1 className='text-3xl font-bold mb-10'>Profile</h1>
        {!isEditUser ? (
          <div className='backdrop-blur-3xl bg-white/5 p-4 rounded shadow w-3/5 h-5/6 flex flex-col relative'>
            <div className="flex justify-center -mt-12">
              <img
                // src={`data:image/png;base64,${user?.avatar}`}
                src={user?.image as string}
                alt="User avatar"
                className="w-24 h-24 rounded-full mb-4 content-center shadow-md"
              />
            </div>
            <div className="text-center mt-2 mb-5">
              <h1 className="text-2xl font-semibold mb-2" id="name">
                {user?.name}
              </h1>
              <p className="text-lg font-bold mb-2">{user?.email}</p>
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
              <button
                className="bg-gray-800 text-white px-2 py-1 rounded w-1/3 content-center"
                onClick={handleEditClick}
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div>
          </div>
        )}
      </div>
    </div>
  );
};
