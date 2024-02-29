import '@/app/globals.css';
import Ebook from '@/lib/modules/EpubViewer/Ebook';
import { store } from '@/lib/store';
import { Provider } from 'react-redux';

export default () => {
  const demoUrl: string = 'Kiếm Lai - Phong Hoả Hí Chư Hầu.epub';
  const theme: string = '/themes/dark.theme.css';
  // const ref = useRef<ViewRef>(null);
  return (
    <Provider store={store}>
      <div className="w-screen h-screen">
        <Ebook demoUrl={demoUrl} theme={theme} />
      </div>
    </Provider>
  );
};
