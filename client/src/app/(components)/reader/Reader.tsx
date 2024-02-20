'use client';
import useEpubReader from '@/lib/hooks/useEpubReader';
import { EpubReaderState, IReaderProps } from '@/types/reader';
import { createContext } from 'react';
import Catalogue from './Catalogue';
import ContentView from './ContentView';
import Panel from './Panel';

export const readerContext = createContext<EpubReaderState>(null);

export default function Reader(props: IReaderProps) {
  const epubReaderState = useEpubReader(props);
  return (
    <readerContext.Provider value={epubReaderState}>
      <Panel />
      <Catalogue />
      <ContentView />
    </readerContext.Provider>
  );
}
