# TechStore - API RESTful v4

Una aplicación web completa de e-commerce desarrollada con Node.js, Express, MongoDB y EJS. Incluye sistema de autenticación, gestión de productos, usuarios y procesamiento de compras.

## 🚀 Características

- **Sistema de Autenticación**: Registro e inicio de sesión con JWT
- **Gestión de Productos**: CRUD completo para productos
- **Gestión de Usuarios**: Sistema de usuarios con diferentes roles
- **Carrito de Compras**: Funcionalidad de compra y historial
- **Interfaz Responsive**: Diseño moderno y adaptable
- **API RESTful**: Endpoints completos para integración

## 📁 Estructura del Proyecto

```
API-RESTFULv4/
│
├── config/
│   └── database.js              # Configuración de MongoDB
│
├── controllers/
│   ├── auth.controller.js       # Lógica de autenticación
│   ├── productos.controller.js  # Gestión de productos
│   ├── usuarios.controller.js   # Gestión de usuarios
│   ├── clientes.controller.js   # Gestión de clientes
│   └── compra.controller.js     # Procesamiento de compras
│
├── middleware/
│   └── auth.middleware.js       # Middleware de autenticación
│
├── models/
│   ├── usuarios.model.js        # Esquema de usuarios
│   ├── productos.model.js       # Esquema de productos
│   └── clientes.model.js        # Esquema de clientes
│
├── routers/
│   ├── auth.routes.js           # Rutas de autenticación
│   ├── views.routes.js          # Rutas para vistas
│   ├── productos.routes.js      # API de productos
│   ├── usuarios.routes.js       # API de usuarios
│   ├── clientes.routes.js       # API de clientes
│   └── compra.routes.js         # Rutas de compras
│
├── views/
│   ├── pages/
│   │   ├── catalogo.ejs         # Página principal/catálogo
│   │   ├── login.ejs            # Página de inicio de sesión
│   │   ├── register.ejs         # Página de registro
│   │   └── perfil.ejs           # Página de perfil de usuario
│   └── partials/
│       ├── header.ejs           # Header común
│       ├── footer.ejs           # Footer común
│       └── head.ejs             # Meta tags y enlaces CSS
│
├── public/
│   ├── css/
│   │   ├── global.css           # Estilos globales
│   │   ├── catalogo.css         # Estilos del catálogo
│   │   └── perfil.css           # Estilos del perfil
│   └── img/                     # Imágenes de productos
│
├── package.json                 # Dependencias y scripts
├── index.js                     # Archivo principal del servidor
└── .env                         # Variables de entorno
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [MongoDB](https://www.mongodb.com/) (local o Atlas)
- [Git](https://git-scm.com/)

### Paso 1: Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd API-RESTFULv4
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=3000

# URL de conexión a MongoDB
# Opción 1: MongoDB local
MONGO_URI=mongodb://localhost:27017/techstore

# Opción 2: MongoDB Atlas (reemplaza con tu conexión)
# MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/techstore

# Clave secreta para JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui

# Entorno de desarrollo
NODE_ENV=development
```

### Paso 4: Configurar MongoDB

#### Opción A: MongoDB Local
1. Instala MongoDB Community Edition
2. Inicia el servicio de MongoDB
3. La base de datos `techstore` se creará automáticamente

#### Opción B: MongoDB Atlas (Recomendado)
1. Crea una cuenta en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crea un cluster gratuito
3. Configura el acceso de red (0.0.0.0/0 para desarrollo)
4. Crea un usuario de base de datos
5. Obtén la cadena de conexión y actualiza `MONGO_URI` en `.env`

### Paso 5: Poblar la Base de Datos (Opcional)

Para agregar productos de ejemplo, puedes usar la API:

```bash
# Ejemplo de producto via API
POST http://localhost:3000/api/productos
Content-Type: application/json

{
  "referencia": "LAPTOP001",
  "nombre": "Laptop Gaming",
  "descripcion": "Laptop para gaming de alta gama",
  "precio": 2500000,
  "stock": 10,
  "publicado": true
}
```

### Paso 6: Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Scripts Disponibles

```bash
npm start          # Ejecuta en modo producción
npm run dev        # Ejecuta en modo desarrollo con nodemon
npm test           # Ejecuta pruebas (si están configuradas)
```

## 📋 Dependencias Principales

- **express**: Framework web para Node.js
- **mongoose**: ODM para MongoDB
- **ejs**: Motor de plantillas
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **cookie-parser**: Manejo de cookies
- **dotenv**: Variables de entorno

## 🌐 Endpoints de la API

### Autenticación
- `GET /auth/login` - Formulario de login
- `POST /auth/login` - Procesar login
- `GET /auth/register` - Formulario de registro
- `POST /auth/register` - Procesar registro
- `GET /auth/logout` - Cerrar sesión

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:ref` - Obtener producto por referencia
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:ref` - Actualizar producto
- `DELETE /api/productos/:ref` - Eliminar producto

### Usuarios
- `GET /api/usuarios` - Obtener usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:email` - Actualizar usuario
- `DELETE /api/usuarios/:email` - Eliminar usuario

### Vistas Web
- `GET /` - Página principal/catálogo
- `GET /catalogo` - Catálogo de productos
- `GET /perfil` - Perfil de usuario (protegido)
- `POST /comprar/:id` - Procesar compra (protegido)

## 🔐 Flujo de Autenticación del Proyecto

El sistema de autenticación utiliza **JWT (JSON Web Tokens)** almacenados en cookies seguras para mantener las sesiones de usuario. A continuación se detalla el proceso completo:

### 📋 Proceso Paso a Paso

#### 1. **Login Inicial**
- Diana entra a `/login` y envía su correo y contraseña a través del formulario.

#### 2. **Verificación de Credenciales**
- El controlador `login_post` en el servidor verifica las credenciales contra la base de datos MongoDB.
- Se utiliza `bcrypt.compare()` para verificar que la contraseña coincida con el hash almacenado.

#### 3. **Creación del Token**
- Si las credenciales son correctas, el servidor llama a `createToken()` y genera un JWT firmado.
- El token contiene el ID del usuario y tiene una expiración de 3 días.

```javascript
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge // 3 días
    });
};
```

#### 4. **Envío de Cookie Segura**
- El servidor envía el token de vuelta a Diana dentro de una cookie con configuración segura:
  - `httpOnly: true` - Previene acceso desde JavaScript del cliente
  - `maxAge` - Define tiempo de expiración
  - El token viaja automáticamente en futuras peticiones

```javascript
res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
```

#### 5. **Navegación a Rutas Protegidas**
- Diana hace clic para ir a `/perfil` (ruta protegida).
- El navegador automáticamente adjunta la cookie con el JWT en la petición.

#### 6. **Middleware de Protección (El Guardia de Seguridad)**
- Antes de llegar al controlador `verPerfil`, la petición pasa por el middleware `protegerRuta`.
- Este middleware actúa como un "guardia de seguridad" que:

```javascript
const protegerRuta = async (req, res, next) => {
    const token = req.cookies.jwt; // Busca la cookie jwt
    
    if (!token) {
        return res.redirect('/login'); // Sin token = redirect
    }
    
    try {
        // Verifica la firma del token con JWT_SECRET
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        
        // Busca al usuario en la base de datos
        const usuario = await Usuario.findById(decodificado.id);
        
        if (usuario) {
            req.usuario = usuario; // Adjunta usuario a la petición
            return next(); // Permite continuar
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        // Token inválido o expirado
        return res.clearCookie('jwt').redirect('/login');
    }
};
```

#### 7. **Acceso Permitido**
- Como el token era válido, la petición llega a `verPerfil`.
- El controlador ya tiene los datos del usuario disponibles en `req.usuario`.
- Se puede acceder a la información sin necesidad de volver a autenticar.

### 🔄 Middleware Adicional: checkUser

Para mostrar información del usuario en todas las páginas (como el header), se utiliza el middleware `checkUser`:

```javascript
// Se ejecuta en TODAS las peticiones
app.use('*', checkUser);

// Hace el usuario disponible en las vistas como res.locals.usuario
// Sin bloquear el acceso si no hay token
```

### 🚪 Cerrar Sesión

El proceso de logout es simple pero efectivo:

```javascript
module.exports.logout_get = (req, res) => {
    // Reemplaza la cookie con una vacía que expira inmediatamente
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}
```

### 🛡️ Ventajas de este Sistema

- **Seguridad**: Los tokens están firmados y no pueden ser modificados
- **Automático**: Las cookies viajan automáticamente en cada petición
- **Persistente**: La sesión se mantiene aunque se cierre el navegador
- **Escalable**: No requiere almacenamiento de sesiones en el servidor
- **Flexible**: Fácil verificación en cualquier ruta que lo necesite

## 👤 Uso de la Aplicación

### Para Usuarios
1. **Registro**: Crear cuenta en `/register`
2. **Login**: Iniciar sesión en `/login`
3. **Explorar**: Ver productos en `/catalogo`
4. **Comprar**: Hacer clic en "Comprar Ahora" (requiere login)
5. **Perfil**: Ver historial en `/perfil`

### Para Desarrolladores
1. Usar la API REST para gestionar datos
2. Autenticación via JWT en cookies
3. Middleware de protección para rutas privadas

## 🚨 Solución de Problemas Comunes

### Error de Conexión a MongoDB
```
Error: connect ECONNREFUSED
```
**Solución**: Verifica que MongoDB esté ejecutándose y la URI sea correcta.

### Error de Token JWT
```
JsonWebTokenError: jwt malformed
```
**Solución**: Limpia las cookies del navegador o verifica JWT_SECRET.

### Error de Puerto en Uso
```
Error: listen EADDRINUSE :::3000
```
**Solución**: Cambia el puerto en `.env` o mata el proceso que usa el puerto 3000.

### Productos no se Muestran
**Solución**: Asegúrate de que los productos tengan `publicado: true`.


## ✨ Autor

**Diana Jiménez**  
Proyecto desarrollado como parte del programa de formación.

---

