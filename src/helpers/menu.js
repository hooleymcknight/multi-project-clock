import store from '../main.js';
const { ipcMain } = require('electron');

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
            click: (menuItem, browserWindow, event) => {
                browserWindow.webContents.send('darkModeToggle', menuItem.checked);
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

export default template