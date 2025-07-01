import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {sequelize} from "./config/dataBase.js";
import { enviroment } from "./config/enviroment.js";
import { routerApi } from "./api/v1/route.js";
import dotenv from "dotenv";
import { FontFamily, Font } from "./models/tables.js"
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
// Aumentar el límite de tamaño para las solicitudes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    // Permite solicitudes sin origin (como Postman o curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
}));


// api
app.use('/api/v1/', routerApi);


async function main() {
    
    try {

        // establecemos conexion con la base de datos
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
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