import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from '@material-tailwind/react';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../../store/auth';
// import { getUser } from '../../store/user';
// import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
export default ({ user }: any) => {
  // const token = useSelector((state) => state.auth.token);
  // const user = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  const handleLogout = () => {
    signOut({
      callbackUrl: '/',
    });
    // dispatch(logout());
  };
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     // const action = await dispatch(getUser());
  //   };
  //   fetchProfile();
  // }, []);

  return (
    <Menu>
      <MenuHandler>
        <div className="flex items-center gap-2 h-[42px]">
          <Avatar
            color="gray"
            size="md"
            src={user.image}
            alt="User Avatar"
            placeholder={null}
          />
          <Typography
            color="white"
            children={user.name}
            placeholder={null}
          ></Typography>
        </div>
      </MenuHandler>
      <MenuList
        className="border-gray-400 bg-opacity-80 backdrop-blur-lg bg-black text-white"
        placeholder={null}
      >
        <MenuItem color="lightBlue" placeholder={null}>
          Tài khoản
        </MenuItem>
        <MenuItem
          color="lightBlue"
          onClick={handleLogout}
          className="flex items-center gap-2 "
          placeholder={null}
        >
          Đăng xuất
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
