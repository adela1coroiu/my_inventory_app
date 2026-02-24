import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import AppRouter from './router/AppRouter.jsx'
import { store } from './store/index.js'
import AuthInitializer from './components/AuthInitializer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <AppRouter />
      </AuthInitializer>
    </Provider>
  </StrictMode>,
)
