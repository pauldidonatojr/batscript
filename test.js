const { app, dialog, BrowserWindow } = require('electron');
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const os = require('os');

const folder = 'C:\\Users\\galico user\\Documents\\batscripts\\test'; // replace with the path of your directory
const tempFolder = path.join(os.tmpdir(), 'tempFolder');

if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder);
}

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    const watcher = chokidar.watch(folder, {
        persistent: true,
        ignoreInitial: true,
    });

    watcher.on('unlink', async (filePath) => {
        const fileName = path.basename(filePath);
        const tempPath = path.join(tempFolder, fileName);

        // Move the file back from tempPath to original location
        if (fs.existsSync(tempPath)) {
            const response = await dialog.showMessageBox(win, {
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Confirm',
                message: `Are you sure you want to delete ${fileName}?`,
            });

            if (response.response === 1) { // User clicked 'No'
                fs.renameSync(tempPath, filePath); // Move back to original location
            } else {
                fs.unlinkSync(tempPath); // Delete from temporary location
            }
        }
    });

    watcher.on('add', (filePath) => {
        const fileName = path.basename(filePath);
        const tempPath = path.join(tempFolder, fileName);

        if (!fs.existsSync(tempPath)) {
            fs.renameSync(filePath, tempPath); // Move to temporary location as soon as it is added
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});


