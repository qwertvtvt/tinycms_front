import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ConfirmProvider } from './provider/ConfirmProvider.jsx'

createRoot(document.getElementById('root')).render(
  <ConfirmProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ConfirmProvider>,
)
