export default function Footer({ chapterName }: any) {
  // theme: 'Dark' | 'Light',
  // const chapterName = useSelector((state: any) => state.ebook.chapterName);
  return (
    <div className="w-screen h-[30px] bg-blue-gray-800">
      {chapterName && (
        <div className="text-center text-white text-xl justify-center self-center">
          <span>{chapterName}</span>
        </div>
      )}
    </div>
  );
}
