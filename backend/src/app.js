import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {sequelize} from "./config/dataBase.js";
import { enviroment } from "./config/enviroment.js";
import { routerApi } from "./api/v1/route.js";
import dotenv from "dotenv";
dotenv.config()

const app = express();

const PORT = enviroment.PORT;

// origenes permitidos para hacer peticiones
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:4200'
];

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : allowedOrigins,
    methods : ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials : true,
}));

// api
app.use('/api/v1/', routerApi);


async function main() {
    
    try {

        // establecemos conexion con la base de datos
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("===================================================")
        console.log("✅ Conexion de la base de datos establecida")
        
        // establecemos conexion con el servidor
        app.listen(PORT, () => {
            console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
            console.log("===================================================")
        })

    } catch (error) {

        console.error("❌ Error al establecer conexion", error)
    }
}

main();