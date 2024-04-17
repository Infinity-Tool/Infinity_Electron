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
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './util';
import MenuBuilder from './menu';
import axios from 'axios';
import { InstallationFile } from '../renderer/Models/InstallationFile';
import fs from 'fs';
import async from 'async';
import { InstallationRequest } from '../renderer/Models/InstallationRequest';
import { InstallMethod } from '../renderer/Services/SelectionContext';
import zlib from 'zlib';
import { IsOkayPath } from '../renderer/Services/utils/PathValidatorUtils';
import LocalizationFile from '../renderer/Models/LocalizationFile';
import RWGMixerFile from '../renderer/Models/RWGMixerFile';

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
      title: `Choose ${folderType} Folder`,
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
  attemptCount = 0,
) {
  try {
    if (shouldCancel) {
      return;
    }

    if (blackListedFileExtensions.some((ext) => file.source.endsWith(ext))) {
      console.warn('Skipping blacklisted file:', file.source);
      mainWindow?.webContents.send('download-error', file.fileName);
      return;
    }

    if (installMethod === InstallMethod.quickInstall) {
      const fileNameWithoutGz = file.destination.replace('.gz', '');
      if (fs.existsSync(fileNameWithoutGz)) {
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
        if (file.source.endsWith('.gz')) {
          decompressFile(file.destination)
            .then(() => {
              mainWindow?.webContents.send('download-complete', file.fileName);
              resolve();
            })
            .catch((error) => {
              mainWindow?.webContents.send('download-error', file.fileName);
              reject(error);
            });
        } else {
          mainWindow?.webContents.send('download-complete', file.fileName);
          resolve();
        }
      });
      writer.on('error', reject);
    });
  } catch (error: any) {
    if (attemptCount < 3) {
      console.log(`Download failed, retrying: ${file.source}`);
      await downloadFile(file, installMethod, attemptCount + 1);
      return;
    }

    mainWindow?.webContents.send('download-error', file.fileName);
  }
}

async function decompressFile(filePath: string) {
  const decompressedFilePath = filePath.replace('.gz', '');
  const readStream = fs.createReadStream(filePath);
  const writeStream = fs.createWriteStream(decompressedFilePath);
  const unzip = zlib.createGunzip();

  return new Promise<void>((resolve, reject) => {
    readStream
      .pipe(unzip)
      .pipe(writeStream)
      .on('finish', () => {
        fs.unlinkSync(filePath); // Delete the gzipped version after decompressing
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function downloadFiles(
  files: InstallationFile[],
  installMethod: InstallMethod,
) {
  return async.eachLimit(files, 8, async (file: InstallationFile) => {
    await downloadFile(file, installMethod);
  });
}

async function buildLocalizationFiles(localizationFiles: LocalizationFile[]) {
  return async.eachLimit(
    localizationFiles,
    1,
    async (file: LocalizationFile) => {
      try {
        if (shouldCancel) {
          return;
        }

        // Ensure the destination files exists
        const destDir = path.dirname(file.destination);
        if (!fs.existsSync(destDir)) {
          throw new Error(
            `Destination localization file does not exist: ${destDir}`,
          );
        }

        const downloadedLocalization = await axios({
          method: 'get',
          url: file.source,
          responseType: 'text',
          headers: {
            'Accept-Encoding': 'gzip',
          },
        });

        // remove the first line from the downloadedLocalization
        const localizationToAppend =
          '\n' +
          downloadedLocalization.data
            .toString()
            .split('\n')
            .slice(1)
            .join('\n');

        const targetLocalization = await fs.readFileSync(
          file.destination,
          'utf-8',
        );
        if (
          targetLocalization &&
          !targetLocalization.includes(localizationToAppend)
        ) {
          fs.appendFileSync(file.destination, localizationToAppend);
        }
      } catch (error: any) {
        mainWindow?.webContents.send('download-error', file.source);
      }
    },
  );
}

async function buildRWGMixerFiles(rwgMixerFiles: RWGMixerFile[]) {
  return async.eachLimit(rwgMixerFiles, 1, async (file: LocalizationFile) => {
    try {
      if (shouldCancel) {
        return;
      }

      // Ensure the destination files exists
      const destDir = path.dirname(file.destination);
      if (!fs.existsSync(destDir)) {
        throw new Error(
          `Destination localization file does not exist: ${destDir}`,
        );
      }

      const downloadedRwgMixerFile = await axios({
        method: 'get',
        url: file.source,
        responseType: 'text',
        headers: {
          'Accept-Encoding': 'gzip',
        },
      });

      const rwgMixerToAppend = downloadedRwgMixerFile.data
        .replace('<compopack>', '')
        .replace('</compopack>', '');

      const targetRwgMixer = await fs.readFileSync(file.destination, 'utf-8');

      let newRwgMixer = targetRwgMixer;

      if (targetRwgMixer && !targetRwgMixer.includes(rwgMixerToAppend)) {
        newRwgMixer = targetRwgMixer.replace(
          '</compopack>',
          rwgMixerToAppend + '\n' + '</compopack>',
        );
      }

      fs.writeFileSync(file.destination, newRwgMixer);
    } catch (error: any) {
      mainWindow?.webContents.send('download-error', file.source);
    }
  });
}

async function clearFolders(request: InstallationRequest) {
  if (!IsOkayPath(request.modsDirectory)) {
    throw new Error('Invalid Mods Directory');
  }
  if (!IsOkayPath(request.localPrefabsDirectory)) {
    throw new Error('Invalid Local Prefabs Directory');
  }

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

    await buildLocalizationFiles(request.localizationFiles);

    await buildRWGMixerFiles(request.rwgMixerFiles);

    if (request.teragon) {
      buildTownPropertyList(
        request.teragon.townPropertyList,
        request.modsDirectory,
      );
      buildPoiPropertyList(
        request.teragon.poiPropertyList,
        request.modsDirectory,
      );
    }

    mainWindow?.webContents.send('install-complete');
  },
);

function buildTownPropertyList(
  teragonTownPropertyList: string,
  modsDirectory: string,
) {
  const terragonDirectory = path.join(modsDirectory, 'TeragonLists');
  if (!fs.existsSync(terragonDirectory)) {
    fs.mkdirSync(terragonDirectory, { recursive: true });
  }

  const townPropertyListPath = path.join(
    terragonDirectory,
    'Town_Property_List_CP.txt',
  );
  fs.writeFileSync(townPropertyListPath, teragonTownPropertyList);
}

const linebreak = '\n';

function buildPoiPropertyList(
  teragonPoiPropertyList: string,
  modsDirectory: string,
) {
  const terragonDirectory = path.join(modsDirectory, 'TeragonLists');
  if (!fs.existsSync(terragonDirectory)) {
    fs.mkdirSync(terragonDirectory, { recursive: true });
  }

  const poiPropertyListPath = path.join(
    terragonDirectory,
    'POI_Property_List_CP.txt',
  );

  const fullString =
    '// CP POI Property List for Teragon' + linebreak + teragonPoiPropertyList;

  fs.writeFileSync(poiPropertyListPath, fullString);
}

ipcMain.on('download-cancel', async (event) => {
  shouldCancel = true;
});

ipcMain.on('get-app-version', async (event) => {
  const version = autoUpdater.currentVersion;
  console.warn('Current version:', version);
  mainWindow?.webContents.send('app-version', version);
});

ipcMain.on('save-json-file', async (event, selection) => {
  const todaysDateYYYYMMDD = new Date().toISOString().split('T')[0];
  const fileName = `Infinity_Selection_${todaysDateYYYYMMDD}.json`;
  const jsonToSave = JSON.stringify(selection, null, 2);

  // Show save file dialog
  const downloadsPath = app.getPath('downloads');
  const defaultPath = path.join(downloadsPath, fileName);

  dialog
    .showSaveDialog({
      title: 'Save Selection File',
      defaultPath,
      filters: [{ name: 'JSON', extensions: ['json'] }],
    })
    .then((result: any) => {
      if (!result.canceled) {
        fs.writeFileSync(result.filePath, jsonToSave);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on('open-json-file', async (event) => {
  // Show open file dialog
  dialog
    .showOpenDialog({
      title: 'Choose Selection File',
      filters: [{ name: 'JSON', extensions: ['json'] }],
    })
    .then((result: any) => {
      if (!result.canceled) {
        const filePath = result.filePaths[0];
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const selection = fileContents;
        mainWindow?.webContents.send('selection-file-selected', selection);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

const blackListedFileExtensions = [
  '.exe',
  '.scr',
  '.com',
  '.cmd',
  '.bat',
  '.js',
  '.jar',
  '.vbs',
  '.wsf',
  '.msi',
  '.pif',
  '.reg',
  '.php',
  '.pl',
  '.py',
  '.rb',
  '.sh.',
  '.ps1',
  '.exe.gz',
  '.scr.gz',
  '.com.gz',
  '.cmd.gz',
  '.bat.gz',
  '.js.gz',
  '.jar.gz',
  '.vbs.gz',
  '.wsf.gz',
  '.msi.gz',
  '.pif.gz',
  '.reg.gz',
  '.php.gz',
  '.pl.gz',
  '.py.gz',
  '.rb.gz',
  '.sh.gz',
  '.ps1.gz',
];
