'use client';
import Reader from '@/app/(components)/reader/Reader';
import '@/app/globals.css';

export default () => {
  const demoUrl = 'demo.epub';
  return (
    <div>
      <Reader url={demoUrl}></Reader>
    </div>
  );
};
