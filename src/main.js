import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL("https://openprocessing.org");
  mainWindow.addListener('did-finish-load', attachPlugin);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

ipcMain.handle('sketch', (event, code) => {
  console.log('Received sketch code:', code);
  const tempDir = process.env.TEMP || process.env.TMPDIR || '/tmp';
  const tempFolder = `${tempDir}/processing-sketches`;
  const sketchFolder = `${tempFolder}/sketch-${Date.now()}/tempSketch/`;
  mkdirSync(sketchFolder, { recursive: true });
  const filePath = `${sketchFolder}/tempSketch.pde`;
  writeFileSync(filePath, code.codeObjects[0].code, { recursive: true });
  console.log(`Sketch written to ${filePath}`);
  const { exec } = require('child_process');
  exec(`processing-java --sketch=${sketchFolder} --run`, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    if (error) {
      console.error(`Error executing sketch: ${error.message}`);
    }
  });
})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
