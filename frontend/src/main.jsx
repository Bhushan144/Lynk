import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Provider } from "react-redux";
import { store } from './store/store.js';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'   // Import Toaster (for popup notifications)
import { SocketContextProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  /* The Provider makes the Redux Store available to any nested component */
  <Provider store={store}>
    {/* BrowserRouter enables routing (changing URL without reloading) */}
    <BrowserRouter>
      <SocketContextProvider>
        <App />
        {/* Toaster is placed here so it can pop up on top of any page */}
        <Toaster position='top-center' />
      </SocketContextProvider>
    </BrowserRouter>
  </Provider>
)
