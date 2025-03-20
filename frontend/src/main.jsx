import { AccountProvider } from './context/AccountContext.jsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AccountProvider>
    <App />
  </AccountProvider>,
)
