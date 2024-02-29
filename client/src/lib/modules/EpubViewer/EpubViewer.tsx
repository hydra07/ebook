import { Loc, ViewRef } from '@/types/epub';
import { Book, Rendition } from 'epubjs';
import {
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

function EpubViewer(
  {
    url,
    epubOptions,
    location,
    bookChanged,
    rendtionChanged,
    pageChanged,
    tocChanged,
    selectionChanged,
    loadingView,
  }: any, //TODO: define type for props
  ref: RefObject<ViewRef> | any,
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [rendition, setRendition] = useState<Rendition | null>(null);
  const currentCfi = useRef<string>('');

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

      console.log(
        'onLocationChange: ',
        locations.locationFromCfi(startCfi),
        currentPage,
        totalPage,
        startCfi,
        endCfi,
        base,
        chapterName,
      );
      pageChanged &&
        pageChanged({
          chapterName,
          currentPage,
          totalPage,
          startCfi,
          endCfi,
          base,
        });
      currentCfi.current = startCfi;
    },
    [book, pageChanged],
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
    if (onRemoveHighlight) ref.current.onRemoveHighlight = onRemoveHighlight;
    if (rendition)
      ref.current.setLocation = (location: string) =>
        rendition.display(location);
  }, [ref, rendition, movePage, onHighlight, onRemoveHighlight]);

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
      if (tocChanged) tocChanged(_toc);
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
  }, [book, bookChanged, tocChanged]);

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

  return (
    <>
      {!isLoaded && loadingView}
      <div ref={ref} />
    </>
  );
}

export default forwardRef(EpubViewer);
