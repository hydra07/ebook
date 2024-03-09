import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ebook from './ebook/ebookSlice';
// const rootReducer = combineReducers({
//   ebook: ebookReducer,
// });
// const persistConfig = {
//   key: 'root',
//   storage,
//   // blacklist: ['ebook'],
// };
// const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });
// export type Store = typeof store;
// export const persistor = persistStore(store);
// export type Persistor = typeof persistor;
// export type EbookState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

const reducer = combineReducers({
  ebook,
});

export type RootState = ReturnType<typeof reducer>;

const store = configureStore({
  reducer,
});

export default store;
