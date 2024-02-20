'use client';
import {
  EpubReaderState,
  ILocationChangeProps,
  IReaderProps,
} from '@/types/reader';
import Epub, { Book, NavItem, Rendition } from 'epubjs';
import { useEffect, useRef, useState } from 'react';
import useBookContent from './useBookContent';
import useBookmark from './useBookmark';
import useBookmarkDrawer from './useBookmarkDrawer';
import useSearchDrawer from './useSearchDrawer';
import useSnackbar from './useSnackBar';
export default function useEpubReader({
  url,
  fontSize,
  epubOptions,
}: IReaderProps): EpubReaderState {
  if (!url) return null;
  const [book, setBook] = useState<Book | null>(null);
  const [ebookUrl, setEbookUrl] = useState(url);
  const { isSearchDrawer, toggleSearchDrawer } = useSearchDrawer();
  const { isBookmarkDrawer, toggleBookmarkDrawer } = useBookmarkDrawer();
  const contentViewRef = useRef<HTMLDivElement>(null);
  const [catalogue, setCatalogue] = useState<NavItem[] | null>(null);
  const [isCatalogue, setIsCatalogue] = useState(false);
  const [isPanelBar, setIsPanelBar] = useState(true);
  const rendition = useRef<Rendition | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [currentChapter, setCurretChapter] = useState('');
  const [currentCfi, setCurrentCfi] = useState('');
  const { isSnackbar, snackbarMessage, showToast } = useSnackbar();

  const toggleCatalogue = () => {
    setIsCatalogue(!isCatalogue);
  };

  useEffect(() => {
    /**
     * mục đích của hàm useEffect này là để fix lỗi ssr trên nextjs
     * khi chạy trên server thì window không tồn tại
     */
    if (typeof window !== 'undefined') {
      const book = Epub(ebookUrl, epubOptions);
      setBook(book);
    }
  }, []);

  // const [book, setBook] = useState(() => Epub(ebookUrl, epubOptions) as Book);
  const initialFontSize = fontSize ? fontSize : '100%';

  const { bookContents, searchBookContents } = useBookContent(book!);
  const { bookmarks, addBookmark, removeBookmark } = useBookmark();

  const init = async () => {
    const { toc } = await book!.loaded.navigation;
    const node = contentViewRef.current as HTMLDivElement;
    const width = window.getComputedStyle(node).getPropertyValue('width');
    const epubRendition = book!.renderTo(node, { width, height: '100%' });
    const firstChapter = toc[0];
    const currentCfi = epubRendition.location?.start.cfi;

    setCurretChapter(firstChapter.href);
    setCurrentCfi(currentCfi);
    setCatalogue(toc);
    rendition.current = epubRendition;

    epubRendition.themes.fontSize(initialFontSize);
    // epubRendition.themes.register('dark', {
    //   body: {
    //     color: 'white',
    //     backgroundColor: 'black',
    //   },
    //   a: {
    //     color: 'red',
    //   },
    //   li: {
    //     'list-style-type': 'none',
    //   },
    // });
    epubRendition.themes.register('dark', 'themes/dark.theme.css');
    epubRendition.themes.select('dark');
    epubRendition.display(currentCfi);

    epubRendition.on(
      'locationChanged',
      ({ percentage, href }: ILocationChangeProps) => {
        setCurretChapter(href);
        setPercentage(percentage);
        setCurrentCfi(epubRendition.location.start.cfi);
        setAtStart(epubRendition.location.atStart);
        setAtEnd(epubRendition.location.atEnd);
      },
    );
  };

  useEffect(() => {
    /**
     * mục đích của hàm useEffect này là để fix lỗi ssr trên nextjs
     * nó phải xác định book tồn tại trước khi gọi hàm init
     */
    if (book) {
      init();
      return () => {
        book!.destroy();
      };
    }
  }, [book ? book : null]);

  return {
    ebookUrl,
    book,
    catalogue,
    isCatalogue,
    rendition,
    contentViewRef,
    percentage,
    atStart,
    atEnd,
    currentChapter,
    isSearchDrawer,
    bookContents,
    initialFontSize,
    bookmarks,
    currentCfi,
    isBookmarkDrawer,
    isSnackbar,
    snackbarMessage,
    isPanelBar,
    setIsPanelBar,
    setEbookUrl,
    toggleSearchDrawer,
    toggleCatalogue,
    setCurretChapter,
    searchBookContents,
    addBookmark,
    removeBookmark,
    toggleBookmarkDrawer,
    showToast,
  };
}
