export default function Header({ changeTheme }: any) {
  return (
    <div className="h-[30px] bg-blue-gray-800">
      <div className="">
        <button onClick={changeTheme}>Dark/Light</button>
      </div>
    </div>
  );
}
