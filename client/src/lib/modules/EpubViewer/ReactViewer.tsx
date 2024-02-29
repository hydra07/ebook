import { ReactViewerProps, ViewRef } from '@/types/epub';
import { debounce } from '@/utils/epub.utils';
import { Book, Contents, Rendition } from 'epubjs';
import {
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import viewerDefaultStyles from '../style/viewerDefautlStyle';
import EpubViewer from './EpubViewer';
function ReactEpub(
  {
    url,
    viewerLayout,
    viewerStyle,
    viewerStyleURL,
    viewerOption,
    onBookInfoChange,
    onPageChange,
    onTocChange,
    onSelection,
    loadingView,
  }: ReactViewerProps, //TODO: define type for props
  ref: RefObject<ViewRef> | any,
) {
  const [book, setBook] = useState<Book | null>(null);
  const [rendition, setRendition] = useState<Rendition | null>(null);
  const [layoutStyle, setLayoutStyle] = useState<{ [key: string]: any }>({});
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
          VIEWER_FOOTER_HEIGHT: 0,
          // VIEWER_FOOTER_HEIGHT: 40,
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

  return (
    <>
      <EpubViewer
        url={url}
        style={layoutStyle}
        bookChanged={bookChanged}
        rendtionChanged={rendtionChanged}
        tocChanged={onTocChange}
        pageChanged={onPageChange}
        selectionChanged={selectionChanged}
        loadingView={loadingView}
        ref={ref}
      />
    </>
  );
}

export default forwardRef(ReactEpub);
