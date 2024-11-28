//frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import Routing from './routes/Routing'
import { PersistGate } from 'redux-persist/integration/react';
import  { persistor } from './Redux/store';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <PersistGate loading={null} persistor={persistor}>
        <Routing />
      </PersistGate>
  </React.StrictMode>,
)

