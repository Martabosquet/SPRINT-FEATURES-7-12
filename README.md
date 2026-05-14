# Sprint Features 7

API REST de productos construida con Express.js para gestionar un catálogo de productos.

## 📋 Descripción

Servidor API que proporciona endpoints para gestionar productos. Incluye validaciones de rutas, manejo de errores y respuestas estructuradas en JSON.

## 🚀 Características

- ✅ API REST con Express.js
- ✅ Rutas protegidas y validadas
- ✅ Health check para monitoreo
- ✅ Gestión de productos
- ✅ Manejo de errores 404
- ✅ Soporte para ES modules

## 📦 Requisitos

- Node.js 16+
- npm

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Martabosquet/SPRINT-FEATURES-7.git
cd SPRINT-FEATURES-7
```

2. Instalar dependencias:
```bash
npm install
```

## ▶️ Uso

Iniciar el servidor en modo desarrollo (con auto-reload):
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 🔌 Endpoints API

### Health Check
Verificar estado del servidor:
```bash
curl http://localhost:3000/health
```

### Productos
Listar todos los productos:
```bash
curl http://localhost:3000/api/products
```

Obtener producto por ID:
```bash
curl http://localhost:3000/api/products/1
```

### Ejemplos de respuesta

**Producto encontrado (200):**
```bash
curl http://localhost:3000/api/products/1
```

**Producto no encontrado (404):**
```bash
curl http://localhost:3000/api/products/999
```

**Ruta no encontrada (404):**
```bash
curl http://localhost:3000/ruta-que-no-existe
```

## 📁 Estructura del Proyecto

```
src/
├── app.js              # Configuración de la aplicación Express
├── server.js           # Punto de entrada del servidor
├── routes/
│   ├── index.routes.js # Rutas principales
│   └── products.routes.js # Rutas de productos
└── db/
    └── products.js     # Datos de productos
```

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia el servidor con auto-reload |
| `npm test` | Ejecuta tests (no configurado) |

## 🛠️ Tecnologías

- **Express.js** 5.2.1 - Framework web
- **Node.js** - Runtime de JavaScript
- **ES Modules** - Módulos ECMAScript

## 👤 Autor

Marta Bosquet

## 📄 Licencia

ISC

## 🔗 Enlaces

- [GitHub Repository](https://github.com/Martabosquet/SPRINT-FEATURES-7)
- [Reportar Issues](https://github.com/Martabosquet/SPRINT-FEATURES-7/issues)