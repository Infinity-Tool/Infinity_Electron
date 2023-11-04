const path = require("path");

const { app, BrowserWindow, dialog, ipcMain, Menu } = require("electron");
const electronDl = require("electron-dl");
const isDev = require("electron-is-dev");
const async = require("async");

electronDl();

// Remove the default menu
Menu.setApplicationMenu(null);

let window;

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 800,
    minWidth: 800,
    height: 600,
    minHeight: 600,
    // icon: path.join(__dirname, "/src/Assets/InfinityLogo.ico"),
    icon: path.join(app.getAppPath(), "/src/Assets/InfinityLogo.ico"),

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

  // window.setIcon(path.join(__dirname, "/src/Assets/InfinityLogo.png"));
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

ipcMain.on("close-app", () => {
  window.close();
});

ipcMain.on("open-discord", () => {
  const { shell } = require("electron");
  shell.openExternal("https://discord.gg/magolis-compopack");
});

ipcMain.on("queue-files-for-download", async (event, files) => {
  console.log("[ELECTRON] queue-files-for-download", files);
  const queue = async.queue(queueNew, 3);
  queue.drain = async (file) => {
    // console.log("[ELECTRON] queue-drain");
    // event.reply("download-queue-drain");
    await queueNew(file);
  };
  queue.push(files);
});

const queueNew = async (file) =>
  electronDl
    .download(window, file.url, file.properties)
    .then((dl) => {
      console.log("[ELECTRON] download-complete", file.properties.fileName);
      window.webContents.send("download-complete", file.properties.fileName);
      return Promise.resolve();
    })
    .catch((err) => {
      window.webContents.send("download-error", file.properties.fileName);
    });
