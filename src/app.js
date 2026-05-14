//PUNTO 2: AQUÍ SOLO SE DEFINE LA APP: SE ENCARGA DE CONFIGURAR EL SERVIDOR, LOS MIDDLEWARES Y LAS RUTAS

import express from 'express';

const app = express();

app.use(express.json()) // le dice a express que entienda JSON
app.use(express.urlencoded({ extended: true })) // Analiza cuerpos de peticiones POST

app.use(healthRouter)
app.use("/routes", productRouter)
app.use("/routes", indexRouter)

