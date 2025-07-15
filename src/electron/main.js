import { app, BrowserWindow } from 'electron'
import path from 'path'

import { registerProductosController } from './controllers/productosController.js';
import { registerCategoriasController } from './controllers/categoriasController.js';
import { registerVentasController } from './controllers/ventasController.js';
import { registerTestController } from './controllers/testController.js';
import { authenticationController } from './controllers/authenticationController.js';
import { registerDashboardController } from './controllers/dashboardController.js';
import {registerUsuariosController} from './controllers/usuariosController.js';


function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(app.getAppPath(), 'src/electron/mascota.png'), // Ajusta la ruta si es necesario
        webPreferences: {
            // Si tienes un preload.js, descomenta la siguiente línea y crea el archivo
            preload: path.join(app.getAppPath(), 'src/electron/preload.js'),
            nodeIntegration: true, // Puedes cambiar esto según tus necesidades de seguridad
            // contextIsolation: true, // Recomendado para seguridad, pero requiere preload.js
        },
    });

    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
        // En desarrollo, carga desde el servidor local de Vite/React
        mainWindow.loadURL('http://localhost:5173'); // Cambia el puerto si usas otro
    } else {
        // En producción, carga el archivo generado
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }
   
    //mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
}

app.whenReady().then(() => {
    createWindow();
    
    authenticationController();
    registerDashboardController();
    registerTestController();
    registerProductosController();
    registerCategoriasController();
    registerVentasController();
    registerUsuariosController();


    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});