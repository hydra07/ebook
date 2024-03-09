import EbookViewer from '@/app/(components)/EbookViewer';
import '@/app/globals.css';
import store from '@/lib/store';
import { Provider } from 'react-redux';

export default () => {
  return (
    <Provider store={store}>
      <EbookViewer />
    </Provider>
  );
};
