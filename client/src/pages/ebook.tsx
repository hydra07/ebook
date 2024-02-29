import Loading from '@/app/(components)/Loading';
import Footer from '@/app/(components)/reader/Footer';
import Header from '@/app/(components)/reader/Header';
import '@/app/globals.css';
import ReactViewer from '@/lib/modules/EpubViewer/ReactViewer';
import { store } from '@/lib/store';
import { ViewRef } from '@/types/epub';
import { Contents } from 'epubjs';
import { useCallback, useRef, useState } from 'react';
import { Provider } from 'react-redux';

export default () => {
  // const demoUrl = 'Kiếm Lai - Phong Hoả Hí Chư Hầu.epub';
  const demoUrl = 'demo.epub';
  const [theme, setTheme] = useState<string>('/themes/dark.theme.css');
  const ref = useRef<ViewRef>(null);
  const [chapterName, setChapterName] = useState('');
  const [viewerLayout, setViewerLayout] = useState({
    MIN_VIEWER_WIDTH: 600,
    MIN_VIEWER_HEIGHT: 300,
    VIEWER_HEADER_HEIGHT: 30,
    VIEWER_FOOTER_HEIGHT: 30,
    VIEWER_SIDEMENU_WIDTH: 0,
  });

  /**
   * Hàm này dùng để xử lý sự kiện khi chuyển trang
   */
  const handlePageChange = useCallback(
    (page: { chapterName: string; currentPage: number; totalPage: number }) => {
      setChapterName(page.chapterName);
    },
    [ref],
  );

  /**
   * Hàm này dùng để xử lý sự kiện khi chọn văn bản
   */
  const handleOnSelection = useCallback(
    (cfiRange: string, contents: Contents) => {
      console.log('selection', cfiRange);
      console.log('contents', contents);
    },
    [ref],
  );

  const handleChangeThemeMode = useCallback((): void => {
    setTheme((prev) =>
      prev === '/themes/dark.theme.css'
        ? '/themes/light.theme.css'
        : '/themes/dark.theme.css',
    );
    console.log('theme', theme);
  }, [ref, theme]);

  return (
    <Provider store={store}>
      <div className="w-screen h-screen">
        <Header changeTheme={handleChangeThemeMode} />
        <ReactViewer
          url={demoUrl}
          viewerLayout={viewerLayout}
          viewerStyleURL={theme}
          onPageChange={handlePageChange}
          onSelection={handleOnSelection}
          loadingView={<Loading />}
          ref={ref}
        />
        <Footer chapterName={chapterName} />
      </div>
    </Provider>
  );
};
