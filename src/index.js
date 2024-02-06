import React from 'react'
import ReactDOM from 'react-dom/client'
import { Online, Offline } from 'react-detect-offline'

import './index.css'
import App from './components/app/app'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.Fragment>
    <Online>
      <App className="app container" />
    </Online>
    <Offline>
      <div className="abstract-about-connection">
        Sorry, something bad happened.
        <br />
        Please check your internet connection
      </div>
    </Offline>
  </React.Fragment>
)
