const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('./store.js');
let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: { width: 800, height: 600 },
    clientTimers: [
      {
        name: 'Client #1',
        count: '0'
      }
    ],
  }
});

const createWindow = () => {
  let { width, height } = store.get('windowBounds');
  let x = store.get('windowPosition')?.x;
  let y = store.get('windowPosition')?.y;

  let settings = { 
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      preload: path.join(__dirname + './../../src/preload.js'),
    }
  };

  if (x) {
    settings.x = x;
    settings.y = y;
  }

  mainWindow = new BrowserWindow(settings);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  });

  mainWindow.on('moved', () => {
    let [ x, y ] = mainWindow.getPosition();
    store.set('windowPosition', { x, y });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('addOrDelete', (event, data) => {
  store.set('clientTimers', data);
});

ipcMain.on('loadSavedTimers', (event, data) => {
  event.reply('loadSavedTimersReply', store.get('clientTimers'));
})

ipcMain.on('updateSavedTimers', (event, data) => {
  store.set('clientTimers', data);
})