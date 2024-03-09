import { isNotNullOrUndefined } from '@/utils/common.utils';

type HeaderProps = {
  onThemeChange: () => void;
  onNavToggle: () => void;
  height: number | null;
  onBookmarkToggle?: () => void;
  onAddBookmark?: () => void;
  onRemoveBookmark?: () => void;
  bookmarkButton?: JSX.Element;
};
/**
 * @name Header
 * @description EbookViewer Header
 * @param {function} onThemeChange - change theme mode
 * @param {number} height - header height (default: 40)
 * @returns {JSX.Element}
 */
export default function Header({
  height,
  onThemeChange,
  onNavToggle,
  onBookmarkToggle,
  onAddBookmark,
  onRemoveBookmark,
  bookmarkButton,
}: HeaderProps) {
  return (
    <div
      className={`w-screen bg-blue-gray-800 flex border-b`}
      style={{ height: `${isNotNullOrUndefined(height) ? height : 40}px` }}
    >
      <div className="flex flex-row w-full justify-between">
        <div className="px-3 items-center justify-start">
          <button onClick={onNavToggle}>
            <img src="/svg/menu-white.svg" alt="menu" className="w-8 h-8" />
          </button>
        </div>
        <div className="justify-end pr-2 space-x-2 flex flex-row">
          <button onClick={onBookmarkToggle}>
            <img
              src="/svg/menu-list-white.svg"
              alt="menu"
              className="w-8 h-8"
            />
          </button>
          {/* <button onClick={onAddBookmark} children="addBookmark" /> */}
          {bookmarkButton}
          <button onClick={onThemeChange}>
            <span>Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
