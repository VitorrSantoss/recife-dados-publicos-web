import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// 👇 Adicione esta linha para importar o seu CSS global
import './styles.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)