# Panel Administrativo CIMASUR

<div align="center">

![CIMASUR](public/LOGO-01.png)

**Sistema de gestión integral para condominios y residencias**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.86.0-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Demo en vivo](https://cimasur-community.vercel.app/)

</div>

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Roles y Permisos](#roles-y-permisos)
- [Base de Datos](#base-de-datos)

---

## Descripción

**CIMASUR** es una aplicación web moderna diseñada para facilitar la gestión administrativa de condominios y residencias. Proporciona herramientas completas para administrar pagos, usuarios, reservas de áreas comunes y auditorías, todo desde una interfaz intuitiva y responsiva.

### Usuarios del sistema

- **Administradores**: Control total sobre pagos, usuarios y configuración del sistema
- **Mesa Directiva**: Acceso a paneles de auditoría y supervisión (solo lectura)
- **Residentes/Propietarios**: Consulta de adeudos, pagos y reserva de áreas comunes

---

## Características

### Gestión de Usuarios y Autenticación
- Sistema de autenticación seguro con Supabase Auth
- Gestión de roles (Administrador, Mesa Directiva, Residente)
- Perfiles de usuario personalizables
- Login rápido con perfiles predefinidos para testing

### Módulo de Pagos
- Registro y seguimiento de pagos de mantenimiento
- Estados de cuenta en tiempo real
- Visualización de adeudos pendientes
- Historial completo de transacciones
- Filtrado por estado de pago (pendiente, pagado, vencido)

### Sistema de Reservas
- Reserva de áreas comunes (Palapa, Cancha de Tenis, Salón de Eventos)
- Calendario visual interactivo
- Verificación de disponibilidad en tiempo real
- Gestión de aprobaciones y rechazos
- Vista de ocupación por día

### Panel de Auditoría
- Dashboard con métricas clave
- Visualización de estados de cuenta
- Reportes de reservas
- Solo lectura para Mesa Directiva

### Interfaz de Usuario
- Diseño moderno y responsivo
- Compatible con dispositivos móviles, tablets y desktop
- Tema personalizable con colores de marca
- Iconos profesionales con Lucide React
- Feedback visual con alertas y notificaciones

---

## Tecnologías

### Frontend
| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **React** | 19.2.0 | Biblioteca principal para la UI |
| **Vite** | 7.2.4 | Build tool y dev server ultrarrápido |
| **Tailwind CSS** | 3.4.17 | Framework CSS utility-first |
| **Lucide React** | 0.554.0 | Biblioteca de iconos moderna |

### Backend & Base de Datos
| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **Supabase** | 2.86.0 | Backend as a Service (BaaS) |
| - | - | PostgreSQL (Base de datos) |
| - | - | Auth (Autenticación) |
| - | - | Realtime (Actualizaciones en tiempo real) |

### Herramientas de Desarrollo
- **ESLint** - Linting de código JavaScript/React
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad CSS cross-browser

---

## Arquitectura

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTPS/WebSocket
         │
┌────────▼────────┐
│   Supabase      │
│  (Backend API)  │
├─────────────────┤
│  • Auth         │
│  • Database     │
│  • Realtime     │
│  • Storage      │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

### Flujo de Datos
1. El usuario interactúa con la interfaz React
2. Los componentes realizan llamadas a la API de Supabase
3. Supabase procesa las solicitudes y consulta PostgreSQL
4. Los datos se devuelven en tiempo real al frontend
5. React actualiza la UI automáticamente

---

## Requisitos Previos Para correr en LOCALHOST

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- Una cuenta en [Supabase](https://supabase.com) (gratuita)
- Git

- Si desea utilizar la pagina ingresa a https://cimasur-community.vercel.app/

---



## Uso

### Usuarios de Prueba

El sistema incluye perfiles de acceso rápido para testing:

| Rol | Email | Descripción |
|-----|-------|-------------|
| Administrador | `admin@cimasur.com` | Control total del sistema |
| Mesa Directiva | `mesa@cimasur.com` | Visualización y auditoría |
| Residente | `vecino@cimasur.com` | Pagos y reservas |



### Flujos Principales

#### Para Administradores
1. Iniciar sesión como administrador
2. Gestionar usuarios desde el panel de usuarios
3. Aprobar/rechazar reservas de áreas comunes
4. Registrar pagos de residentes
5. Generar reportes de auditoría

#### Para Residentes
1. Iniciar sesión con credenciales
2. Consultar estado de cuenta y adeudos
3. Solicitar reserva de áreas comunes
4. Ver historial de pagos

---

## Estructura del Proyecto

```
Cimasur_App/
├── public/
│   ├── LOGO-01.png          # Logo de la aplicación
│   └── vite.svg             # Favicon
├── src/
│   ├── assets/              # Recursos estáticos
│   ├── App.jsx              # Componente principal (65KB)
│   ├── App.css              # Estilos del componente
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales + Tailwind
├── .gitignore               # Archivos ignorados por Git
├── eslint.config.js         # Configuración de ESLint
├── index.html               # HTML base
├── package.json             # Dependencias y scripts
├── postcss.config.js        # Configuración PostCSS
├── tailwind.config.js       # Configuración Tailwind
├── vite.config.js           # Configuración Vite
└── README.md                # Este archivo
```

### Componentes Principales

El archivo `src/App.jsx` contiene:
- `LoginScreen` - Pantalla de autenticación
- `AdminDashboard` - Panel de administrador
- `ResidentDashboard` - Panel de residente
- `BookingCalendar` - Calendario de reservas
- `PaymentManager` - Gestor de pagos
- `UserManager` - Gestor de usuarios

---

## Roles y Permisos

### Administrador (`admin`)
- Crear, editar y eliminar usuarios
- Registrar y gestionar pagos
- Aprobar/rechazar reservas
- Acceso completo a todos los módulos
- Configuración del sistema

### Mesa Directiva (`mesa_directiva`)
- Ver dashboard de auditoría
- Consultar estados de cuenta
- Ver reservas de áreas comunes
- No puede modificar datos
- Solo lectura

### Residente (`residente`)
- Consultar su estado de cuenta
- Ver sus pagos pendientes y realizados
- Solicitar reservas de áreas comunes
- Ver sus reservas
- No puede ver datos de otros usuarios
- No puede aprobar reservas

---

## Base de Datos

### Diagrama ER (Entidad-Relación)

```
profiles (usuarios)
├── id (UUID, PK)
├── email (TEXT, UNIQUE)
├── full_name (TEXT)
├── role (TEXT: admin|mesa_directiva|residente)
├── unit_number (TEXT)
├── tower (TEXT)
├── apartment (TEXT)
└── created_at (TIMESTAMPTZ)
     │
     ├──< payments (pagos)
     │    ├── id (SERIAL, PK)
     │    ├── user_id (UUID, FK)
     │    ├── amount (DECIMAL)
     │    ├── status (TEXT: pendiente|pagado|vencido)
     │    ├── due_date (DATE)
     │    └── paid_date (DATE)
     │
     └──< bookings (reservas)
          ├── id (SERIAL, PK)
          ├── user_id (UUID, FK)
          ├── area_id (INTEGER, FK)
          ├── booking_date (DATE)
          ├── start_time (TIME)
          ├── end_time (TIME)
          └── status (TEXT: pendiente|aprobado|rechazado)

common_areas (áreas comunes)
├── id (SERIAL, PK)
├── name (TEXT)
├── display_name (TEXT)
└── description (TEXT)
```


