import React from 'react';
import { render } from 'react-dom';
import Main from 'containers/Main';

import 'css/global.css';
import 'css/antd.css';
import 'css/antd-btn.css';

const mainElem = document.getElementById('app');

if (mainElem) {
    render(
        <Main />,
        mainElem
    );
}
