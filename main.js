const electron = require('electron')
const rq = require('electron-require');
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function startApp() {


  var cp = require('child_process');
  var ind = require('./import/modules/index');
  //var gazer = require('./import/modules/watcher');
  /*var child = cp.fork('./import/modules/index');
  console.log("started index");

  child.on('message', function(m) {
    // Receive results from child process
    console.log(m);
  });*/

  mainWindow = new BrowserWindow({width: 800, height: 107, frame: false, transparent: true})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/import/search/searcher.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  //indexer.routineIndex();

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', startApp)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
