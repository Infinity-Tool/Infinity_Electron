/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import electronDl from 'electron-dl';
import async from 'async';
import { resolveHtmlPath } from './util';
import MenuBuilder from './menu';
import { Mutex } from 'async-mutex';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const mutex = new Mutex();
// ipcMain.on('ipc-example', async (event, arg) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc-example', msgTemplate('pong'));
// });

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

electronDl();

// Remove the default menu
Menu.setApplicationMenu(null);

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 900,
    minWidth: 800,
    height: 700,
    minHeight: 600,
    icon: getAssetPath('icon.ico'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('open-folder-dialog', (event, folderType) => {
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then((result: any) => {
      result.folderType = folderType;
      event.reply('selected-directory', result);
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on('close-app', () => {
  mainWindow?.close();
});

ipcMain.on('open-discord', () => {
  shell.openExternal('https://discord.gg/magolis-compopack');
});

ipcMain.on('open-patreon', () => {
  shell.openExternal('https://www.patreon.com/Compopack');
});

const queueNew = async (file: any) => {
  if (mainWindow === null || mainWindow === undefined) {
    return Promise.reject();
  }
  await electronDl
    .download(mainWindow, file.url, file.properties)
    .then((dl) => {
      // console.debug('[ELECTRON] download-complete', file.properties.fileName);
      // console.log('[ELECTRON] download-complete', file.properties);
      console.log('[ELECTRON] dl', dl);
      mainWindow?.webContents.send(
        'download-complete',
        file.properties.fileName,
      );
      return Promise.resolve();
    })
    .catch((err) => {
      mainWindow?.webContents.send('download-error', file.properties.fileName);
    });
};

// const queue = async.queue(async (task) => queueNew(task), 4);

const queue = async.queue(async (task) => {
  await mutex.runExclusive(async () => {
    return queueNew(task);
  });
}, 3);

ipcMain.on('queue-files-for-download', async (event, files) => {
  // console.log('event', event);
  queue.drain();
  queue.push(files);
});

ipcMain.on('download-cancel', async (event) => {
  await queue.kill();
});

// ipcMain.on('clear-path', async (event, path) => {
//   // Check if path is valid.
//   // If not, return a failed event

//   // Loop through all files and folder in the given path.
// });
