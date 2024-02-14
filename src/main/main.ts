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
import { resolveHtmlPath } from './util';
import MenuBuilder from './menu';
import axios from 'axios';
import { InstallationFile } from '../renderer/Models/InstallationFile';
import fs from 'fs';
import async from 'async';
import { InstallationRequest } from '../renderer/Models/InstallationRequest';
import { InstallMethod } from '../renderer/Services/SelectionContext';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

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
    width: 1000,
    minWidth: 800,
    height: 800,
    minHeight: 600,
    icon: getAssetPath('icon.ico'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  if (isDebug) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

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

let shouldCancel = false; // Flag to indicate whether downloads should be canceled

async function downloadFile(
  file: InstallationFile,
  installMethod: InstallMethod,
) {
  try {
    if (shouldCancel) {
      console.log('Download canceled:', file.source);
      return;
    }

    if (installMethod === InstallMethod.quickInstall) {
      if (fs.existsSync(file.destination)) {
        mainWindow?.webContents.send('download-complete', file.fileName);
        return;
      }
    }

    const response = await axios({
      method: 'get',
      url: file.source,
      responseType: 'stream',
      headers: {
        'Accept-Encoding': 'gzip',
      },
    });

    // Ensure the destination directory exists
    const destDir = path.dirname(file.destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const writer = fs.createWriteStream(file.destination);
    response.data.pipe(writer);

    return new Promise((resolve: any, reject) => {
      writer.on('finish', () => {
        mainWindow?.webContents.send('download-complete', file.fileName);
        return resolve();
      });
      writer.on('error', reject);
    });
  } catch (error: any) {
    mainWindow?.webContents.send('download-error', file.fileName);
    throw error;
  }
}

async function downloadFiles(
  files: InstallationFile[],
  installMethod: InstallMethod,
) {
  async.eachLimit(
    files,
    8,
    async (file: InstallationFile) => {
      await downloadFile(file, installMethod);
    },
    function (err) {
      if (err) {
        console.error('A file failed to download');
      } else {
        console.log('All files have been downloaded successfully');
      }
    },
  );
}

async function clearFolders(request: InstallationRequest) {
  const deleteFiles = async (directory: string) => {
    if (fs.existsSync(directory)) {
      fs.rmdirSync(directory, { recursive: true });
    }
  };

  await deleteFiles(request.modsDirectory);
  await deleteFiles(request.localPrefabsDirectory);
}

ipcMain.on(
  'queue-files-for-download',
  async (event, request: InstallationRequest) => {
    shouldCancel = false;

    const installMethod = request.installMethod;

    if (installMethod === InstallMethod.cleanInstall) {
      try {
        await clearFolders(request);
      } catch (err) {
        mainWindow?.webContents.send('clean-install-error', err);
        return;
      }
    }

    await downloadFiles(request.files, installMethod);
  },
);

ipcMain.on('download-cancel', async (event) => {
  shouldCancel = true;
});
