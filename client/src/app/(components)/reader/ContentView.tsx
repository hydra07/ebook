'use client';
import { useContext, useEffect } from 'react';
import { readerContext } from './Reader';
// import './contenview.less';
import './contentview.css';

export default function ContentView() {
  const context = useContext(readerContext);
  if (!context) return null;

  const { rendition, atStart, atEnd, isPanelBar } = context;

  const goPrevPage = async () => {
    rendition.current && (await rendition.current.prev());
  };

  const goNextPage = async () => {
    rendition.current && (await rendition.current.next());
  };

  const handleKeyPress = ({ key }: KeyboardEvent) => {
    key && key === 'ArrowRight' && goNextPage();
    key && key === 'ArrowLeft' && goPrevPage();
  };

  const offListenKeyup = () => {
    document.removeEventListener('keyup', handleKeyPress, false);
  };

  useEffect(() => {
    offListenKeyup();
    rendition.current?.on('keyup', handleKeyPress);
    document.addEventListener('keyup', handleKeyPress, false);

    return offListenKeyup;
  }, [rendition.current]);

  return (
    <div
      className={
        isPanelBar
          ? 'content-view content-view--withbar'
          : 'content-view content-view--fullscreen'
      }
    >
      <div className="content-view__pagination" onClick={goPrevPage}>
        {/* <ArrowBackIosIcon color={atStart ? 'disabled' : undefined}></ArrowBackIosIcon> */}
        <button hidden={atStart ? true : false}>{'<'}</button>
      </div>
      <div
        className="content-view content-view__book text-white"
        ref={context.contentViewRef}
      ></div>
      <div className="content-view__pagination" onClick={goNextPage}>
        {/* <ArrowForwardIosIcon color={atEnd ? 'disabled' : undefined} ></ArrowForwardIosIcon> */}
        <button hidden={atEnd ? true : false}>{'>'}</button>
      </div>
    </div>
  );
}
