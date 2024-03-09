import useBookController from '@/lib/hooks/ebook/useBookController';
import useBookStyle from '@/lib/hooks/ebook/useBookStyle';
import useBookmark from '@/lib/hooks/ebook/useBookmark';
import useContextMenu from '@/lib/hooks/ebook/useContextMenu';
import useDrawer from '@/lib/hooks/ebook/useDrawer';
import ReactViewer from '@/lib/modules/ReactViewer/ReactViewer';
import { ViewerRef } from '@/types/ebook';
import { useRef, useState } from 'react';
import Loading from './Loading';
import Footer from './reader/Footer';
import Header from './reader/Header';
import RightDrawer from './reader/RightDrawer';
import TableOfContent from './reader/TableOfContent';

function getTheme(): string {
  return '/themes/dark.theme.css';
}

export default () => {
  const viewerRef = useRef<ViewerRef>(null);
  const [url, setUrl] = useState<string>(
    // 'Kiếm Lai - Phong Hoả Hí Chư Hầu.epub',
    'Cú Sốc Tương Lai - Alvin Toffler.epub',
  );
  const { isLeftDrawer, isRightDrawer, toggleLeftDrawer, toggleRightDrawer } =
    useDrawer();

  const {
    theme,
    setTheme,
    onThemeChange,
    bookStyle,
    bookOption,
    viewerLayout,
  } = useBookStyle({ viewerRef });

  const {
    currentLocation,
    onPageMove,
    onPageChange,
    onBookChangeInfor,
    onTocChange,
    onLocationChange,
  } = useBookController({ viewerRef });

  const { bookmarkItem, bookmarkButton } = useBookmark({
    onLocationChange,
    onTonggle: toggleRightDrawer,
  });

  const { onSelection } = useContextMenu({ viewerRef });

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Header
        onThemeChange={onThemeChange}
        onNavToggle={toggleLeftDrawer}
        height={viewerLayout.VIEWER_HEADER_HEIGHT}
        onBookmarkToggle={toggleRightDrawer}
        bookmarkButton={bookmarkButton()}
      />
      <ReactViewer
        url={url}
        viewerStyleURL={theme}
        viewerLayout={viewerLayout}
        viewerStyle={bookStyle}
        onBookInfoChange={onBookChangeInfor}
        viewerOption={bookOption}
        onPageChange={onPageChange}
        onTocChange={onTocChange}
        onSelection={onSelection}
        loadingView={<Loading />}
        ref={viewerRef}
      />
      <Footer
        title={currentLocation.chapterName}
        currentPage={currentLocation.currentPage}
        totalPage={currentLocation.totalPage}
        onPageMove={onPageMove}
        height={viewerLayout.VIEWER_FOOTER_HEIGHT}
      />
      <TableOfContent
        isToggle={isLeftDrawer}
        onToggle={toggleLeftDrawer}
        onLocation={onLocationChange}
      />
      <RightDrawer
        isToggle={isRightDrawer}
        onToggle={toggleRightDrawer}
        children={bookmarkItem()}
      />
    </div>
  );
};
