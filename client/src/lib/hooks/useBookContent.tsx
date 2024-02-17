'use client';
import { BookContents, MatchSearches } from '@/types/reader';
import { Book } from 'epubjs';
import { convert } from 'html-to-text';
import { useEffect, useState } from 'react';

export default function useBookContent(book: Book) {
  const [bookContents, setBookContents] = useState<BookContents>([]);

  const getBookContents = async () => {
    const spine = await book.loaded.spine;
    const contents: BookContents = [];
    for (let item of (spine as any).items) {
      if (!item.href) return;

      const doc = await book.load(item.href);
      const innerHTML = (doc as Document).documentElement.innerHTML;
      const innerText = convert(innerHTML);

      contents.push({
        href: item.href,
        text: innerText.split(/\n+/),
      });
    }

    setBookContents(contents);
  };

  const searchText = (searchString: string): MatchSearches => {
    const regexp = new RegExp(searchString, 'ig');

    let res: MatchSearches = [];
    for (let content of bookContents) {
      for (let paragraph of content.text) {
        if (paragraph.match(regexp) !== null) {
          res.push({
            paragraph,
            href: content.href,
          });
        }
      }
    }

    return res;
  };
  useEffect(() => {
    // console.log('book', book);
    book && getBookContents();
  }, []);

  return {
    bookContents,
    searchBookContents: searchText,
  };
}
