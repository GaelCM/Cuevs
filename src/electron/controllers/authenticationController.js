import 'dotenv/config';
import { ipcMain } from 'electron';
import db  from '../db.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



function authenticationController(){
    ipcMain.handle('login', (event, username, password) => {
        const stmt = db.prepare('SELECT * FROM usuarios WHERE usuario = ?');
        const res = stmt.get(username);
        if(!res){
            return{
                success: false,
                message: 'Usuario no encontrado',
                data: res,
                path: '/login'
            }
        }

        const user = res;
        const isPasswordValid = bcrypt.compareSync(password, user.password_hash);

        if(!isPasswordValid){
            return{
                success: false,
                message: 'Contraseña incorrecta',
                data: user,
                path: '/login'
            }
        }

        const token = jwt.sign({id: user.id}, "t0ps3cr3t", {expiresIn: '1h'}); //aqui se genera el token 

        return{
            success: true,
            message: 'Login exitoso',
            data: user,
            token: token,
            path: '/'
        }
    });
}

export {authenticationController};
