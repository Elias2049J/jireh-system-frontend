const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * Crea la ventana principal de la aplicación
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // opcional
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Carga el index.html generado por Angular
  win.loadFile(path.join(__dirname, 'dist/pos/browser/index.html'));

  // Opcional: abrir DevTools automáticamente
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // En macOS es común volver a crear una ventana en la app cuando
    // se hace clic en el icono del dock y no hay otras ventanas abiertas
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Salir cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
