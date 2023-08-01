const { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } = require('electron');
const path = require('path');
const Store = require('./store.js');

// import template from './helpers/menu.js'
import { stopWatch, swTimeouts, getSwTimeouts } from './js/timerBE.js';
import getAllTimers from './helpers/getAllTimers.js';
import iconOverlay from '../src/assets/mpc_icon_overlay.png';

let mainWindow;
let closedBySelf = false;

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
        count: 0
      }
    ],
  }
});

const template = [
  // { role: 'appMenu' }
  // ...(isMac
  //     ? [{
  //         label: app.name,
  //         submenu: [
  //         { role: 'about' },
  //         { type: 'separator' },
  //         { role: 'services' },
  //         { type: 'separator' },
  //         { role: 'hide' },
  //         { role: 'hideOthers' },
  //         { role: 'unhide' },
  //         { type: 'separator' },
  //         { role: 'quit' }
  //         ]
  //     }]
  //     : []),
  // { role: 'fileMenu' }
  {
      label: 'File',
      submenu: [
      // isMac ? { role: 'close' } : { role: 'quit' }
      ]
  },
  {
    label: 'Settings',
    submenu: [
      {
        label: 'Aggro Mode',
        type: 'checkbox',
        checked: store.get('aggroMode') ? store.get('aggroMode') : false,
        click: (menuItem, browserWindow, event) => {
          browserWindow.webContents.send('aggroModeToggle', menuItem.checked);
          store.set('aggroMode', menuItem.checked);
        }
      }
    ]
  },
  // { role: 'viewMenu' }
  {
      label: 'View',
      submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { role: 'togglefullscreen' },
      { 
          label: 'Toggle Dark Mode',
          type: 'checkbox',
          checked: store.get('darkMode') ? store.get('darkMode') : false,
          click: (menuItem, browserWindow, event) => {
              browserWindow.webContents.send('darkModeToggle', menuItem.checked);
              store.set('darkMode', menuItem.checked);
          }
      }
      ]
  },
  // { role: 'windowMenu' }
  {
      label: 'Window',
      submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      // ...(isMac
      //     ? [
      //         { type: 'separator' },
      //         { role: 'front' },
      //         { type: 'separator' },
      //         { role: 'window' }
      //     ]
      //     : [
      //         { role: 'close' }
      //     ])
      ]
  },
  {
      role: 'help',
      submenu: [
      {
          label: 'See My Portfolio',
          click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://hooleymcknight.com/')
          }
      }
      ]
  }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const createWindow = () => {
  let { width, height } = store.get('windowBounds');
  let x = store.get('windowPosition')?.x;
  let y = store.get('windowPosition')?.y;

  let settings = {
    width,
    height,
    icon: path.join(__dirname + './../../src/assets/mpc_icon_200.png'),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      // preload: path.join(__dirname + './../../src/preload.js'),
    }
  };

  if (x) {
    settings.x = x;
    settings.y = y;
  }

  mainWindow = new BrowserWindow(settings);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // mainWindow.setMinimizable(false);

  if (store.get('darkMode')) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('darkModeToggle', true);
    });
  }

  if (store.get('aggroMode')) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('aggroModeToggle', true);
    });
  }

  mainWindow.on('minimize', () => {
    // console.log('stop frontend running timers')
    console.log('send stopAllTimers')
    mainWindow.webContents.send('stopAllTimers');
  })

  mainWindow.on('restore', () => {
    // clearTimeout(swTimeout); // ============================================= use this elsewhere
    // clearTimeout(swTimeout);
    // console.log('des', swTimeout._destroyed);

    // check if a timer is currently running
    // { id: data.id, count: totalCount, timeout: swTimeout }

    // const swTimeouts = getSwTimeouts();
    // console.log(swTimeouts) // { id: data.id, count: totalCount, timeout: swTimeout }
    const runningTimers = swTimeouts.filter(x => x !== null).filter(x => x.timeout?._destroyed == false);
    if (runningTimers.length) {
      // clear all currently running timers
      swTimeouts.filter(x => x !== null).forEach((obj) => {
        clearTimeout(obj.timeout);
      })
      // if so, make sure it's updated in the front end
      const allTimers = getAllTimers(store, runningTimers);
      console.log(runningTimers[0].count);
      // console.log(allTimers)
      console.log('send loadsaved timers reply, 180ish')
      mainWindow.webContents.send('loadSavedTimersReply', allTimers);
    }
  });

  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  });

  mainWindow.on('moved', () => {
    const [ x, y ] = mainWindow.getPosition();
    store.set('windowPosition', { x, y });
  });

  mainWindow.on('close', (e) => {
    if (!closedBySelf) {
      e.preventDefault();
      mainWindow.webContents.send('saveTimers');
    }
  });

  return mainWindow;
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
    mainWindow = createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('closeWindow', (event, data) => {
  closedBySelf = true;
  mainWindow.close();
});

ipcMain.on('addOrDelete', (event, data) => {
  store.set('clientTimers', data);
});

ipcMain.on('loadSavedTimers', (event, data) => {
  event.reply('loadSavedTimersReply', store.get('clientTimers'));
});

ipcMain.on('updateSavedTimers', (event, data) => {
  store.set('clientTimers', data);
});

ipcMain.on('requestAggro', (event, data) => {
  event.reply('sendAggroState', store.get('aggroMode'));
});

ipcMain.on('timersToggled', (event, data) => {
  if (data) {
    let nimage = nativeImage.createFromBuffer(Buffer.from(iconOverlay));
    mainWindow.setOverlayIcon(nimage, 'timers are going');
  }
  else {
    mainWindow.setOverlayIcon(null, 'timers are all stopped');
  }
});

ipcMain.on('stopWatch', (event, data) => {
  // console.log('stopwatch event received')
  data.win = mainWindow;
  stopWatch(data);
});

// move and uncomment the below if needed for testing

// ipcMain.send('testEvent', data);