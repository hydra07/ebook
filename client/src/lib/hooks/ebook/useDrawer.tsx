import { useState } from 'react';

export default function useDrawer() {
  const [isLeftDrawer, setIsLeftDrawer] = useState<boolean>(false);
  const [isRightDrawer, setIsRightDrawer] = useState<boolean>(false);

  const toggleLeftDrawer = () => {
    setIsLeftDrawer((prev) => !prev);
  };
  const toggleRightDrawer = () => {
    setIsRightDrawer((prev) => !prev);
  };
  return {
    isLeftDrawer,
    isRightDrawer,
    toggleLeftDrawer,
    toggleRightDrawer,
  };
}
