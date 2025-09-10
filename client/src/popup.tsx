import { createRoot } from 'react-dom/client';
import AppExtension from './AppExtension';
import './index.css';

// We declare chrome as a global variable to avoid reference errors
declare const chrome: any;

// We initialize i18n conditionally if needed
if (
  typeof window !== 'undefined' &&
  typeof chrome !== 'undefined' &&
  chrome.runtime
) {
  import('./i18n');
}

createRoot(document.getElementById('root')!).render(<AppExtension />);
