import { EbookState } from '@/lib/store';
import { Loc, ViewRef } from '@/types/epub';
import { cfiRangeSplitter, debounce } from '@/utils/epub.utils';
import { Book, Contents, Rendition } from 'epubjs';
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import viewerDefaultStyles from '../../modules/style/viewerDefautlStyle';

function useEbook(
  {
    url,
    viewerLayout,
    viewerStyle,
    viewerStyleURL,
    viewerOption,
    onBookInforChange,
    onPageChange,
    onTocChange,
    onSelection,
    loadingView,
  }: any,
  ref: RefObject<ViewRef> | any,
): { ref: RefObject<ViewRef> } {
  const dispatch = useDispatch();
  function useActionCallback(type: string, deps: any[]) {
    const dispatch = useDispatch();
    return useCallback(
      (payload: any) => {
        dispatch({ type, payload });
      },
      [dispatch, ...deps],
    );
  }
  const { isLoaded, book, rendition } = useSelector(
    (state: EbookState) => state.ebook,
  );
  const setIsLoaded = useActionCallback('ebook/setIsLoaded', [isLoaded]);
  const setBook = useActionCallback('ebook/setBook', [book]);
  const setRendition = useActionCallback('ebook/setRendition', [rendition]);

  const [layoutStyle, setLayoutStyle] = useState<{ [key: string]: any }>({});
  const currentCfi = useRef<string>('');
  const [epubOptions, setEpubOptions] = useState({});
  /**
   * Hàm này dùng để di chuyển trang
   * @param type 'prev' hoặc 'next'
   * @returns void
   * @dependencies rendition
   */
  const movePage = useCallback(
    (type: 'prev' | 'next') => {
      if (!rendition) return;
      if (type === 'prev') return rendition.prev();
      else return rendition.next();
    },
    [rendition],
  );

  /**
   * Hàm này dùng để di chuyển trang bằng phím
   * @param key
   * @returns void
   * @dependencies movePage():void
   */
  const handleKeyPres = useCallback(
    ({ key }: any) => {
      key && key === 'ArrowLeft' && movePage('prev');
      key && key === 'ArrowRight' && movePage('next');
    },
    [movePage],
  );

  /**
   * Hàm này sẽ chạy khi loc/location thay đổi
   * @param loc
   * @returns void
   * @dependencies book, pageChanged
   */
  const onLocationChange = useCallback(
    (loc: Loc) => {
      const startCfi = loc && loc.start;
      const endCfi = loc && loc.end;
      const base = loc && loc.start.slice(8).split('!')[0]; //TODO: chưa hiểu dùng để làm gì ?

      if (!book) return;
      const spineItem = book.spine.get(startCfi);
      const navItem = book.navigation.get(spineItem.href);
      const chapterName = navItem && navItem.label.trim();

      const locations = book.locations as any; //TODO: sửa type cho locations
      const currentPage = locations && locations.locationFromCfi(startCfi);
      const totalPage = locations && locations.total;

      // setChapterName(chapterName);
      onPageChange &&
        onPageChange({
          chapterName,
          currentPage,
          totalPage,
          startCfi,
          endCfi,
          base,
        });
      currentCfi.current = startCfi;
    },
    [book, onPageChange],
  );

  /**
   * Hàm này sẽ chạy khi chọn text
   * @param cfiRange as string
   * @param callback as (e: any) => void
   * @returns color as string
   * @returns void
   * @dependencies rendition
   */
  const onHighlight = useCallback(
    (cfiRange: string, callback?: (e: any) => void, color?: string) => {
      if (!rendition) return;

      rendition.annotations.remove(cfiRange, 'highlight');
      rendition.annotations.highlight(
        cfiRange,
        {},
        callback,
        'epub-highlight',
        {
          // fill: color || '#fdf183',
          fill: color || '#f22',
        },
      );
      // console.log('onHighlight: ', cfiRange);
    },
    [rendition],
  );

  /**
   * Hàm này sẽ chạy khi bỏ highlight
   * @param cfiRange as string
   * @returns void
   * @dependencies rendition
   */
  const onRemoveHighlight = useCallback(
    (cfiRange: string) => {
      if (!rendition) return;
      rendition.annotations.remove(cfiRange, 'highlight');
    },
    [rendition],
  );

  const registerGlobalFunc = useCallback(() => {
    if (!ref.current) return;
    if (movePage) {
      ref.current.prevPage = () => movePage('prev');
      ref.current.nextPage = () => movePage('next');
    }
    ref.current.getCurrentCfi = () => currentCfi.current;
    if (onHighlight) ref.current.onHighlight = onHighlight;
    // console.log('ref.current.onHighlight: ', ref.current.onHighlight);
    if (onRemoveHighlight) ref.current.onRemoveHighlight = onRemoveHighlight;
    if (rendition)
      ref.current.setLocation = (location: string) =>
        rendition.display(location);
  }, [ref, rendition, movePage, onHighlight, onRemoveHighlight]);

  const [bookStyle, setBookStyle] = useState({
    fontFamily: 'Origin',
    fontSize: 25,
    lineHeight: 1.4,
    marginHorizontal: 0,
    marginVertical: 0,
  });
  const [bookOption, setBookOption] = useState({
    flow: 'paginated',
    resizeOnOrientationChange: true,
    spread: 'auto',
  });

  const currentSelection = useRef<{
    cfiRange: string;
    contents: Contents | null;
  }>({
    cfiRange: '',
    contents: null,
  });

  /**
   * Run book changed
   * @method
   * @param book Epub Book
   */
  const bookChanged = (book: Book) => setBook(book);

  /**
   * Run rendition changed
   * @method
   * @param rendition Epub Rendition
   */
  const rendtionChanged = (rendition: Rendition) => setRendition(rendition);

  /**
   * Run selection changed [Debounce]
   * @method
   * @param cfiRange CFIRange
   * @param contents Selection Epub Contents
   */
  const selectionChanged = (cfiRange: string, contents: Contents) => {
    currentSelection.current = { cfiRange, contents };
    console.log('selectionChanged: ', cfiRangeSplitter(cfiRange));
  };

  /**
   * Viewer resizing function
   * @method
   */
  const onResize = useMemo(
    () =>
      debounce(250, () => {
        if (!rendition) return;

        const viewerLayout_ = viewerLayout || {
          MIN_VIEWER_WIDTH: 600,
          MIN_VIEWER_HEIGHT: 300,
          VIEWER_HEADER_HEIGHT: 0,
          // VIEWER_FOOTER_HEIGHT: 0,
          VIEWER_FOOTER_HEIGHT: 40,
          VIEWER_SIDEMENU_WIDTH: 0,
        };

        const { innerWidth: win_w, innerHeight: win_h } = window;
        const componentHeight =
          viewerLayout_.VIEWER_HEADER_HEIGHT +
          viewerLayout_.VIEWER_FOOTER_HEIGHT;
        const w =
          win_w -
          ~~(
            ((win_w - viewerLayout_.MIN_VIEWER_WIDTH) / 100) *
            bookStyle.marginHorizontal
          );

        const h =
          bookOption.flow === 'scrolled-doc'
            ? win_h - componentHeight
            : win_h -
              componentHeight -
              ~~(
                ((win_h - componentHeight - viewerLayout_.MIN_VIEWER_HEIGHT) /
                  100) *
                bookStyle.marginVertical
              );
        const marginVertical =
          bookOption.flow === 'scrolled-doc'
            ? ''
            : `${
                ~~(
                  ((win_h - componentHeight - viewerLayout_.MIN_VIEWER_HEIGHT) /
                    100) *
                  bookStyle.marginVertical
                ) / 2
              }px`;

        setLayoutStyle((layout) => {
          if (
            layout.width !== w ||
            layout.height !== h ||
            layout.marginTop !== marginVertical
          ) {
            return {
              ...layout,
              width: w,
              height: h,
              marginTop: marginVertical,
              marginBottom: marginVertical,
            };
          }
          return layout;
        });
        try {
          rendition.resize(w, h);
          // rendition.resize(win_w, win_h);
        } catch {}
      }),
    [
      rendition,
      viewerLayout,
      bookStyle.marginHorizontal,
      bookStyle.marginVertical,
      bookOption.flow,
    ],
  );

  /**
   * Selection Event, run when run mouseup event
   * @method <br/>
   * - Fire after the Epubjs selected event. [about 300ms]
   */
  const onSelected = useCallback(async () => {
    if (!ref.current) return;

    const iframe = ref.current.querySelector('iframe');
    if (!iframe) return;

    const iframeWin = iframe.contentWindow;
    if (!iframeWin) return;

    const selection_ = iframeWin.getSelection();
    if (!selection_) return;

    const selectionText = selection_.toString();
    if (selectionText === '') return;

    const cfiRange: string = await new Promise((resolve) =>
      setTimeout(() => resolve(currentSelection.current.cfiRange), 350),
    );
    if (!cfiRange) return;

    const contents = currentSelection.current.contents;
    if (!contents) return;

    onSelection && onSelection(cfiRange, contents);
    // console.log('onSelected: ', selectionText);
  }, [ref, onSelection]);

  /** Ref checker */
  useEffect(() => {
    if (!ref) {
      throw new Error(
        '[React-Epub-Viewer] Put a ref argument that has a ViewerRef type.',
      );
    }
  }, [ref]);

  /** Set viewer Styles/Options */
  useEffect(() => {
    viewerStyle && setBookStyle((v) => ({ ...v, ...viewerStyle }));
    viewerOption && setBookOption((v) => ({ ...v, ...viewerOption }));
  }, [viewerStyle, viewerOption]);

  /** Apply viewer Styles/Options */
  useEffect(() => {
    if (!rendition) return;

    onResize();

    const newStyle = {
      ...viewerDefaultStyles,
      body: {
        'padding-top': '0px !important',
        'padding-bottom': '0px !important',
        'font-size': `${bookStyle.fontSize}px !important`,
      },
      p: {
        'font-size': `${bookStyle.fontSize}px !important`,
        'line-height': `${bookStyle.lineHeight} !important`,
      },
    };

    rendition.flow(bookOption.flow);
    rendition.spread(bookOption.spread);

    if (bookStyle.fontFamily !== 'Origin') {
      Object.assign(newStyle.body, {
        'font-family': `${bookStyle.fontFamily} !important`,
      });
    }

    if (bookOption.flow === 'scrolled-doc') {
      // Scroll type
      Object.assign(newStyle.body, {
        margin: 'auto !important',
      });
    } else if (bookOption.spread === 'auto') {
      // View 2 pages
      Object.assign(newStyle.body, {});
    } else {
      // View 1 page
      Object.assign(newStyle.body, {});
    }

    if (!!viewerStyleURL) {
      rendition.themes.registerUrl('main', viewerStyleURL);
    }

    rendition.themes.register('default', newStyle);

    rendition.themes.select('main');
  }, [
    rendition,
    bookStyle.fontFamily,
    bookStyle.fontSize,
    bookStyle.lineHeight,
    viewerStyleURL,
    bookOption,
    onResize,
  ]);

  /** Emit screen resizing event */
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);

  /** Emit selection event */
  useEffect(() => {
    if (!rendition) return;
    rendition.on('mouseup', onSelected);
    return () => rendition.off('mouseup', onSelected);
  }, [rendition, onSelected]);
  /**
   *  Ref checker
   */
  useEffect(() => {
    if (!ref.current) {
      throw new Error('EpubViewer: ref is not defined');
    }
  }, [ref]);

  /**
   *  init book
   */
  useEffect(() => {
    if (!url) return;

    let mounted: boolean = true;
    let _book: Book | any = null;

    if (!mounted) return;
    if (_book) {
      _book.destroy();
    }

    _book = new Book(url, epubOptions);
    setBook(_book);
    // setEbook(_book);
    return () => {
      mounted = false;
    };
  }, [url, epubOptions, setBook, setIsLoaded]);

  /**
   * book changed
   */
  useEffect(() => {
    if (!book) return;
    if (bookChanged) bookChanged(book);

    book.loaded.navigation.then(({ toc }) => {
      const _toc = toc.map((item) => ({
        label: item.label,
        href: item.href,
      }));
      setIsLoaded(true);
      if (onTocChange) onTocChange(_toc);
    });

    book.ready
      .then(() => {
        if (!book) return;

        const stored = localStorage.getItem(book.key() + '-localtions');
        if (stored) {
          book.locations.load(stored);
        } else {
          book.locations.generate(1024);
        }
      })
      .then(() => {
        if (!book) return;
        localStorage.setItem(book.key() + '-localtions', book.locations.save());
      });
  }, [book, bookChanged, onTocChange]);

  /**
   * rendtion changed
   */
  useEffect(() => {
    if (!rendition) return;
    if (rendtionChanged) rendtionChanged(rendition);
  }, [rendition, rendtionChanged]);

  /** EpubOptions changed */
  useEffect(() => {
    let mounted: boolean = true;
    if (!book) return;
    const node = ref.current;
    if (!node) return;
    node.innerHTML = '';

    book.ready.then(() => {
      if (!mounted) return;

      if (book.spine) {
        const loc = book.rendition?.location?.start?.cfi;

        const _redition = book.renderTo(node, {
          // contained: true,
          width: '100%',
          height: '100%',
          ...epubOptions,
        });
        setRendition(_redition);

        if (loc) _redition.display(loc);
        else _redition.display();
      }
    });
    return () => {
      mounted = false;
    };
  }, [ref, book, epubOptions, setRendition]);

  /** Location changed */
  useEffect(() => {
    if (!ref.current || !location) return;
    if (ref.current.setLocation) ref.current.setLocation(location);
  }, [ref, location]);

  /**
   * Emit Viewer Event
   * - Register move event
   * - Register location changed event
   * - Register selection event
   */
  useEffect(() => {
    if (!rendition) return;

    // Emit global control function
    registerGlobalFunc();

    document.addEventListener('keyup', handleKeyPres, false);
    rendition.on('keyup', handleKeyPres);
    rendition.on('locationChanged', onLocationChange);
    selectionChanged && rendition.on('selected', selectionChanged);

    return () => {
      document.removeEventListener('keyup', handleKeyPres, false);
      rendition.off('keyup', handleKeyPres);
      rendition.off('locationChanged', onLocationChange);
      selectionChanged && rendition.off('selected', selectionChanged);
    };
  }, [rendition, registerGlobalFunc, handleKeyPres]);

  return {
    // isLoaded,
    ref,
  };
}

export default useEbook;
