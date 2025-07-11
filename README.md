# TechStore - API RESTful v5

Una aplicación web completa de e-commerce desarrollada con Node.js, Express, MongoDB y EJS. Incluye sistema de autenticación, gestión de productos, usuarios, clientes y procesamiento de compras.

---

## 🚀 Características

- **Sistema de Autenticación:** Registro e inicio de sesión con JWT (token en cookie segura)
- **Gestión de Productos:** CRUD completo para productos
- **Gestión de Usuarios y Clientes:** CRUD y perfil de usuario/cliente
- **Compras:** Procesamiento de compra, historial y perfil
- **Interfaz Responsive:** Diseño moderno y adaptable (EJS + CSS)
- **API RESTful:** Endpoints completos para integración

---

## 📁 Estructura del Proyecto

```
API-RESTFULv5/
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── clientes.controller.js
│   │   ├── compra.controller.js
│   │   ├── productos.controller.js
│   │   └── usuarios.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── clientes.model.js
│   │   ├── productos.model.js
│   │   └── usuarios.model.js
│   ├── routers/
│   │   ├── auth.routes.js
│   │   ├── clientes.routes.js
│   │   ├── compra.routes.js
│   │   ├── productos.routes.js
│   │   └── usuarios.routes.js
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   │   ├── catalogo.css
│   │   │   ├── global.css
│   │   │   └── perfil.css
│   │   ├── img/
│   │   └── js/
│   │       └── headerMenu.js
│   ├── views/
│   │   ├── pages/
│   │   │   ├── catalogo.ejs
│   │   │   ├── error.ejs
│   │   │   ├── login.ejs
│   │   │   ├── perfil.ejs
│   │   │   └── register.ejs
│   │   └── partials/
│   │       ├── footer.ejs
│   │       ├── head.ejs
│   │       └── header.ejs
│   ├── .env
│   ├── app.js
│   ├── package.json
│   └── router.js
└── README.md
```

---

## 🛠️ Instalación y Configuración

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [MongoDB](https://www.mongodb.com/) (local o Atlas)
- [Git](https://git-scm.com/)

---

### Paso 1: Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd API-RESTFULLv5
```

### Paso 2: Instalar Dependencias

Instala dependencias en **backend** y **frontend** POR SEPARADO:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` **en backend** y otro **en frontend** según tus credenciales y puertos:

#### `backend/.env`

```env
PORT=9090
MONGO_URI=mongodb://localhost:27017/techstore
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
NODE_ENV=development
```

#### `frontend/.env`

```env
PORT=3000
URL_BASE=http://localhost:9090
NODE_ENV=development
```

---

### Paso 4: Configurar MongoDB

**Opción A: MongoDB Local**
1. Instala MongoDB Community Edition
2. Inicia el servicio de MongoDB
3. La base de datos `techstore` se creará automáticamente

**Opción B: MongoDB Atlas**
1. Crea una cuenta en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crea un cluster gratuito
3. Configura el acceso de red (0.0.0.0/0 para desarrollo)
4. Crea un usuario de base de datos
5. Obtén la cadena de conexión y actualiza `MONGO_URI` en `.env` del backend

---

### Paso 5: Poblar la Base de Datos (Opcional)

Puedes agregar productos de ejemplo usando la API de productos.

---

### Paso 6: Ejecutar la Aplicación

En dos terminales diferentes (uno para backend y otro para frontend):

```bash
# Terminal 1: Backend
cd backend
npm run dev
npx nodemon index.js

# Terminal 2: Frontend
cd frontend
npm run dev 
npx nodemon app.js
```

La aplicación estará disponible en `http://localhost:3000` (frontend) y la API en `http://localhost:9090` (backend).

---

## 🔧 Scripts Disponibles

### En backend y frontend:

```bash
npm start          # Ejecuta en modo producción
npm run dev        # Ejecuta en modo desarrollo con nodemon
```

---

## 📋 Dependencias Principales

- **express**: Framework web para Node.js
- **mongoose**: ODM para MongoDB
- **ejs**: Motor de plantillas para frontend
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **cookie-parser**: Manejo de cookies
- **dotenv**: Variables de entorno

---

## 👤 Uso de la Aplicación

1. **Registro:** Crear cuenta en `/register`
2. **Login:** Iniciar sesión en `/login`
3. **Explorar:** Ver productos en `/catalogo`
4. **Comprar:** Comprar productos (requiere login)
5. **Perfil:** Consultar historial y datos en `/perfil`

---

## 🌐 Endpoints REST y Web Principales

### Autenticación (API Backend)
- `POST /v2/api/auth/register` - Registrar usuario
- `POST /v2/api/auth/login` - Login
- `GET /v2/api/auth/logout` - Logout

### Usuarios (API Backend)
- `GET /v2/api/usuarios` - Listar usuarios
- `POST /v2/api/usuarios` - Crear usuario
- `PUT /v2/api/usuarios/:email` - Actualizar usuario
- `DELETE /v2/api/usuarios/:email` - Eliminar usuario
- `GET /v2/api/usuarios/perfil` - Obtener perfil autenticado (**protegido**)

### Productos (API Backend)
- `GET /v2/api/productos` - Listar productos
- `POST /v2/api/productos` - Crear producto
- `PUT /v2/api/productos/:ref` - Actualizar producto
- `DELETE /v2/api/productos/:ref` - Eliminar producto

### Clientes (API Backend)
- `GET /v2/api/clientes` - Listar clientes
- `GET /v2/api/clientes/usuario/:usuarioId` - Buscar cliente por usuario
- `POST /v2/api/clientes` - Crear cliente
- `PUT /v2/api/clientes/usuario/:usuarioId` - Actualizar cliente
- `DELETE /v2/api/clientes/usuario/:usuarioId` - Eliminar cliente

### Compras (API Backend)
- `POST /v2/api/compras/comprar/:productoId` - Realizar compra (**protegido**)

### Vistas Web (Frontend)
- `GET /` - Página principal/login
- `GET /catalogo` - Catálogo de productos
- `GET /login` - Login
- `POST /login` - Procesar login
- `GET /register` - Registro
- `POST /register` - Procesar registro
- `GET /perfil` - Perfil de usuario (**protegido**)
- `POST /comprar/:productoId` - Comprar producto (**protegido**)
- `GET /auth/logout` - Cerrar sesión

---

## 🔐 Flujo de Autenticación

- El backend genera un **JWT** al iniciar sesión y lo envía como cookie segura (`jwt`).
- El frontend mantiene la sesión y utiliza la cookie para acceder a rutas protegidas.
- El middleware `protegerRuta` verifica el JWT para proteger endpoints sensibles.
- El perfil de usuario se obtiene mediante `/v2/api/usuarios/perfil`, solo si el usuario está autenticado.

---

## 🚨 Solución de Problemas Comunes

### Error de Conexión a MongoDB
```
Error: connect ECONNREFUSED
```
**Solución:** Verifica que MongoDB esté ejecutándose y la URI esté correcta.

### Error de Token JWT
```
JsonWebTokenError: jwt malformed
```
**Solución:** Limpia las cookies del navegador o revisa JWT_SECRET.

### Error de Puerto en Uso
```
Error: listen EADDRINUSE :::3000
```
**Solución:** Cambia el puerto en `.env` o libera el puerto.

### Productos no se Muestran
**Solución:** Asegúrate de que los productos tengan `publicado: true`.

---

## ✨ Autor

**Diana Jiménez**  
Proyecto desarrollado como parte del programa de formación SENA.

---