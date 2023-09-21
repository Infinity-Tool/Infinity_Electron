const path = require("path");

const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const { download } = require("electron-dl");
const isDev = require("electron-is-dev");

let window;

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      //this line is crucial
      preload: path.join(app.getAppPath(), "./preload.js"),
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  window.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    window.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("open-folder-dialog", (event, folderType) => {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      // console.log("selected-directory", result, folderType);
      event.reply("selected-directory", result, folderType);
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on("download-file", (event, info) => {
  info.properties.onProgress = (status) =>
    window.webContents.send("download-progress", status);

  console.log("[ELECTRON] download-file", info.properties.fileName);

  download(window, info.url, info.properties)
    .then((dl) => {
      console.log("[ELECTRON] download-complete", info.properties.fileName);

      return window.webContents.send(
        "download-complete",
        info.properties.fileName
      );
    })
    .catch((err) => {
      window.webContents.send("download-error", info.properties.fileName);
    });
});

ipcMain.on("download-files", async (event, files) => {
  // Download files one at a time, wait for each one to complete before starting the next
  // This is to avoid the issue where multiple downloads are started at the same time
  // and the download progress events get mixed up
  await files.reduce((promise, file) => {
    return promise.then(() => downloadNew(file));
  }, Promise.resolve());
});

const downloadNew = async (file) => {
  download(window, file.url, file.properties)
    .then((dl) => {
      console.log("[ELECTRON] download-complete", file.properties.fileName);
      window.webContents.send("download-complete", file.properties.fileName);
      return Promise.resolve();
    })
    .catch((err) => {
      window.webContents.send("download-error", file.properties.fileName);
    });
};

ipcMain.on("queue-files-for-download", async (event, files) => {
  // Download files one at a time, wait for each one to complete before starting the next
  // This is to avoid the issue where multiple downloads are started at the same time
  // and the download progress events get mixed up
  await files.reduce((promise, file) => {
    return promise.then(() => queueNew(file));
  }, Promise.resolve());
});

const queueNew = async (file) => {
  return download(window, file.url, file.properties)
    .then((dl) => {
      console.log("[ELECTRON] download-complete", file.properties.fileName);
      window.webContents.send("download-complete", file.properties.fileName);
      return Promise.resolve();
    })
    .catch((err) => {
      window.webContents.send("download-error", file.properties.fileName);
    });
};
