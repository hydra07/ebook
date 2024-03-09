import { Bookmarks, Highlight, Page, Toc } from '@/types/ebook';
import { createSlice } from '@reduxjs/toolkit';

interface EbookState {
  book: any;
  currentLocation: Page;
  theme: string;
  toc: Toc[];
  highLight: Highlight[];
  bookmarks: Bookmarks;
}

const initialBook = {
  coverURL: '',
  title: '',
  description: '',
  author: '',
  published_date: '',
  modified_date: '',
};

const initialCurrentLocation: Page = {
  chapterName: '-',
  currentPage: 0,
  totalPage: 0,
  startCfi: '',
  endCfi: '',
  base: '',
};

const initialState: EbookState = {
  book: initialBook,
  currentLocation: initialCurrentLocation,
  theme: '',
  toc: [],
  highLight: [],
  bookmarks: [],
};

// Slice
const ebookSlice = createSlice({
  name: 'ebook',
  initialState,
  reducers: {
    updateBook(state, action) {
      state.book = action.payload;
    },
    clearBook(state) {
      state.book = initialBook;
    },
    updateCurrentPage(state, action) {
      state.currentLocation = action.payload as Page;
    },
    updateToc(state, action) {
      state.toc = action.payload;
    },
    clearToc(state) {
      state.toc = [];
    },
    updateCurrentTheme(state, action) {
      state.theme = action.payload;
    },
    updateBookmark(state, action) {
      state.bookmarks = action.payload;
    },
  },
});

export const {
  updateBook,
  updateCurrentPage,
  updateToc,
  updateCurrentTheme,
  updateBookmark,
} = ebookSlice.actions;
export default ebookSlice.reducer;
