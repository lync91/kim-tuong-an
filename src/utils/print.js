import React from 'react';
import { renderToString } from 'react-dom/server';
import TemplatePhieu from '../components/template';
import { html } from './htmlstring';
import { remote } from 'electron';
const { BrowserWindow } = remote;


const bwipjs = remote.require('bwip-js');

const options = {
  silent: true,
  printBackground: true,
  color: false,
  margin: {
    marginType: 'printableArea'
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Header of the Page',
  footer: 'Footer of the Page'
}
export function printPreview(data, preview) {
  console.log(data);
  const win = new BrowserWindow({
    show: preview,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const barOptions = {
    bcid: 'qrcode',       // Barcode type
    text: data.sophieu,    // Text to encode
    scale: 1,               // 3x scaling factor
    // height: 10,              // Bar height, in millimeters
    includetext: true,            // Show human-readable text
    textxalign: 'center',        // Always good to set this
  }

  bwipjs.toBuffer(barOptions, function (err, png) {
    if (err) {console.log(err);}
    else {
      const src = 'data:image/png;base64,' + png.toString('base64');
      const htmlString = renderToString(<TemplatePhieu data={{ ...data, ...{ src: src } }} />);

      const finalHtml = html.replace('{body}', htmlString);

      let list = win.webContents.getPrinters();
      console.log("All printer available are ", list);

      win.loadURL(`data:text/html,${encodeURIComponent(finalHtml)}`);
      if (!preview) win.webContents.on('did-finish-load', () => {
        win.webContents.print(options, (success, failureReason) => {
          if (!success) console.log(failureReason);
          console.log('Print Initiated');
        });
      });
    }
  });
}
