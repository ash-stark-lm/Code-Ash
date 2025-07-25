import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="769479299819-7m11kru327h79v0svp5e4hqngspbrnng.apps.googleusercontent.com">
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter>
            <div className="font-sans">
              <App />
            </div>
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  </StrictMode>
)
