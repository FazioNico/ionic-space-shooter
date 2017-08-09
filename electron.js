/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   09-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 09-08-2017
 */


  const electron = require('electron')
  const app = electron.app
  const BrowserWindow = electron.BrowserWindow

  const path = require('path')
  const url = require('url')

  let mainWindow

  function createWindow () {
      mainWindow = new BrowserWindow({width: 800, height: 600})

      mainWindow.loadURL(url.format({
          pathname: path.join(__dirname, './platforms/browser/www/index.html'),
          protocol: 'file:',
          slashes: true
      }))

      mainWindow.on('closed', function () {
          mainWindow = null
      })
  }

  app.on('ready', createWindow)

  app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') {
          app.quit()
      }
  })

  app.on('activate', function () {
      if (mainWindow === null) {
          createWindow()
      }
  })
