'use client';
import { useSession } from 'next-auth/react';
export default () => {
  const { data: session } = useSession();

  return (
    <div className="p-10">
      Dang nhap thanh cong
      <div>{`ma token la ${session?.user.accessToken}`}</div>
      <div>{session?.user.id}</div>
      <div>{session?.user.name}</div>
      <div>{session?.user.email}</div>
      <div>{session?.user.image}</div>
    </div>
  );
};
