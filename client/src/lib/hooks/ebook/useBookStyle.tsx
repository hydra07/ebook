import { RootState } from '@/lib/store';
import { updateCurrentTheme } from '@/lib/store/ebook/ebookSlice';
import { BookOption, BookStyle, ViewerLayout, ViewerRef } from '@/types/ebook';
import { RefObject, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
type Props = {
  viewerRef: RefObject<ViewerRef> | any;
};
type useBookStyle = {
  theme: string;
  setTheme: (theme: string) => void;
  onThemeChange: () => void;
  bookStyle: BookStyle;
  setBookStyle: (style: BookStyle) => void;
  bookOption: BookOption;
  setBookOption: (option: BookOption) => void;
  viewerLayout: ViewerLayout;
  setViewerLayout: (layout: ViewerLayout) => void;
};
/**
 * hooks này sinh ra với mục đích quản lý style, theme, layout của ebook
 * @param viewerRef RefObject<ViewerRef>
 * @returns
 */
export default function useBookStyle({ viewerRef }: Props): useBookStyle {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.ebook.theme);
  const [theme, setTheme] = useState<string>('/themes/dark.theme.css');
  const [bookStyle, setBookStyle] = useState<BookStyle>({
    fontFamily: 'Origin',
    fontSize: 22,
    lineHeight: 1.4,
    marginHorizontal: 13,
    marginVertical: 7,
  });
  const [bookOption, setBookOption] = useState<BookOption>({
    flow: 'paginated',
    resizeOnOrientationChange: true,
    spread: 'auto',
  });
  const [viewerLayout, setViewerLayout] = useState<ViewerLayout>({
    MIN_VIEWER_WIDTH: 600,
    MIN_VIEWER_HEIGHT: 300,
    VIEWER_HEADER_HEIGHT: 40,
    VIEWER_FOOTER_HEIGHT: 40,
    VIEWER_SIDEMENU_WIDTH: 0,
  });

  const onThemeChange = useCallback(() => {
    setTheme((prev) =>
      prev === '/themes/dark.theme.css'
        ? '/themes/light.theme.css'
        : '/themes/dark.theme.css',
    );
    dispatch(updateCurrentTheme(theme));
    console.log('theme', currentTheme);
  }, [viewerRef]);

  return {
    theme,
    setTheme,
    onThemeChange,
    bookStyle,
    setBookStyle,
    bookOption,
    setBookOption,
    viewerLayout,
    setViewerLayout,
  };
}
