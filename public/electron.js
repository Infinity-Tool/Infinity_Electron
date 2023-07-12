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

  download(window, info.url, info.properties)
    .then((dl) =>
      window.webContents.send("download-complete", info.properties.fileName)
    )
    .catch((err) => {
      window.webContents.send("download-error", info.properties.fileName);
    });
});

// ipcMain.on("download-file", (event, info) => {
//   console.log("download-file", info);

//   // info.properties.onProgress = (status) =>
//   //   window.webContents.send("download-progress", status);

//   download(BrowserWindow.getFocusedWindow(), info.url, info.properties).then(
//     (dl) => {
//       console.log("electron download-complete", dl);
//       return event.reply("download-complete", info.properties.fileName);
//       // return window.webContents.send("download-complete", info.properties.fileName)
//     }
//     //window.webContents.send("download-complete", info.url)
//   );
// });
