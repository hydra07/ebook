import { EbookState } from '@/types/epub';
import { createSlice } from '@reduxjs/toolkit';

const initialState: EbookState = {
  isLoaded: false,
  book: null,
  rendition: null,
};
const ebookSlice = createSlice({
  name: 'ebook',
  initialState,
  reducers: {
    setIsLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
    setBook: (state, action) => {
      state.book = action.payload;
    },
    setRendition: (state, action) => {
      state.rendition = action.payload;
    },
    // setCurrentCfi: (state, action) => {
    //   state.currentCfi = action.payload;
    // },
  },
  extraReducers: (builder) => {},
});

export const {} = ebookSlice.actions;
export default ebookSlice.reducer;
