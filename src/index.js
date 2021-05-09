import React from 'react'
import { render } from 'react-dom'
import App from './containers/App'
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div')

root.id = 'root'
document.body.appendChild(root)

// Now we can render our application into it
render(<ConfigProvider locale={vi_VN}>
  <App />
</ConfigProvider>
  , document.getElementById('root'))
