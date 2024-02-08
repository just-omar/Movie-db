import React from 'react'
import ReactDOM from 'react-dom/client'
import { Offline } from 'react-detect-offline'
import { Alert } from 'antd'

import './index.css'
import App from './components/app/app'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.Fragment>
    <Offline>
      {/* <div className="abstract-about-connection">
        Sorry, something bad happened.
        <br />
        Please check your internet connection
      </div> */}
      <Alert message={'Please check your internet connection'} type="error" />
    </Offline>
    <App className="app container" />
  </React.Fragment>
)
