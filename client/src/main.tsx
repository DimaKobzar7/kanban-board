import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

import './index.scss';

const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  console.error('Root element not found');
}