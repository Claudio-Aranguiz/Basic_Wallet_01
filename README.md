# 💳 AlkeWallet - Billetera Digital

## 📖 Descripción del Proyecto

**AlkeWallet** es una aplicación web de billetera digital desarrollada como parte del trabajo práctico del Módulo 2 - Fundamentos del desarrollo Frontend. La aplicación permite a los usuarios gestionar su dinero digital de forma segura y sencilla.

## 🚀 Estado Actual del Proyecto

**Progreso: ~40% Completado** ⭐⭐⭐⭐⭐

### ✅ Funcionalidades Implementadas

- **🔐 Sistema de Autenticación**
  - Registro de nuevos usuarios con validación completa
  - Inicio de sesión con email y contraseña
  - Modal de bienvenida personalizado
  - Validaciones en tiempo real con jQuery

- **👥 Gestión de Usuarios**
  - Base de datos JSON con usuarios de prueba
  - Perfiles de usuario con información personal
  - Sistema de cuentas con números únicos

- **🎨 Interfaz de Usuario**
  - Diseño responsive para múltiples dispositivos
  - Navegación intuitiva entre páginas
  - Estilos CSS organizados por resolución de pantalla
  - Tema oscuro con colores corporativos

- **📱 Páginas Principales**
  - Página de inicio (Landing)
  - Login y registro integrados
  - Menú principal del usuario
  - Página de depósitos (en desarrollo)
  - Página de transferencias (en desarrollo)
  - Historial de transacciones (en desarrollo)

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos responsive y animaciones
- **JavaScript (ES6+)** - Lógica de la aplicación
- **jQuery 3.6+** - Manipulación DOM y validaciones
- **Bootstrap 5.3** - Framework CSS (en migración desde 4.6)

### Fuentes y CDNs
- **Google Fonts** - Montserrat
- **Font Awesome** - Iconografía
- **Bootstrap CDN** - Componentes UI

### Base de Datos
- **JSON** - Almacenamiento temporal de datos
- **LocalStorage** - Sesiones de usuario (implementación futura)

## 📁 Estructura del Proyecto

```
AlkeWallet/
├── 📄 index.html                 # Página principal (fuera de views/)
├── 📄 database.json              # Base de datos principal
├── 📄 README.md                  # Este archivo
├── 📄 TODO.txt                   # Lista de tareas pendientes
├── 📄 notasDelDesarrollador.txt  # Notas del desarrollo
├── 📁 views/                     # Páginas de la aplicación
│   ├── 📄 index.html             # Landing page
│   ├── 📄 login.html             # Autenticación
│   ├── 📄 menu.html              # Dashboard principal
│   ├── 📄 deposit.html           # Depósitos (WIP)
│   ├── 📄 sendmoney.html         # Transferencias (WIP)
│   └── 📄 transactions.html      # Historial (WIP)
├── 📁 css/                       # Estilos organizados
│   ├── 📄 styles.css             # Hoja principal
│   ├── 📄 mobile.css             # Responsive móvil
│   ├── 📄 tablet.css             # Responsive tablet
│   ├── 📄 desktop.css            # Responsive escritorio
│   ├── 📄 notebooks.css          # Pantallas grandes
│   └── 📄 modals-alerts.css      # Modales y alertas
├── 📁 js/                        # Scripts de la aplicación
│   ├── 📄 auth.js                # Sistema de autenticación
│   ├── 📄 register.js            # Registro de usuarios
│   └── 📄 validation.js          # Validaciones de formularios
├── 📁 data/                      # Datos adicionales
│   └── 📄 database.json          # Copia de seguridad
└── 📁 img/                       # Recursos gráficos
    └── [avatares y assets]
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local (opcional: Live Server, XAMPP, etc.)

### Instalación

1. **Clonar o descargar** el proyecto
```bash
git clone [url-del-repositorio]
cd AlkeWallet
```

2. **Ejecutar la aplicación**
   - Abrir `views/index.html` en el navegador, O
   - Usar Live Server en VS Code, O
   - Configurar servidor local

### Usuarios de Prueba

| Email | Contraseña | Saldo | Descripción |
|-------|------------|-------|-------------|
| `admin@alkewallet.com` | `admin123` | $1,000,000 | Administrador |
| `juan.perez@email.com` | `123456` | $250,000 | Usuario regular |
| `test@test.com` | `123` | $100,000 | Usuario de prueba |

## 🎯 Funcionalidades Principales

### 🔐 Autenticación
- [x] Registro con validación de campos
- [x] Inicio de sesión con email/contraseña
- [x] Modal de bienvenida animado
- [ ] Gestión de sesiones persistentes
- [ ] Recuperación de contraseña

### 💰 Gestión de Saldo
- [x] Visualización de saldo (estático)
- [ ] Conexión con base de datos real
- [ ] Actualización en tiempo real
- [ ] Historial de cambios

### 💸 Transacciones
- [ ] Depósitos con múltiples métodos de pago
- [ ] Transferencias entre usuarios
- [ ] Validación de saldo suficiente
- [ ] Confirmaciones de transacción

### 📊 Historial
- [ ] Lista de transacciones del usuario
- [ ] Filtros por tipo y fecha
- [ ] Detalles expandibles
- [ ] Exportación de datos

## 🔧 Desarrollo

### Arquitectura del Código

#### JavaScript Modules
- **AuthManager** - Gestión de autenticación
- **UserRegistration** - Registro de usuarios
- **ValidationSystem** - Validaciones de formularios

#### Patrones Utilizados
- **MVC** - Separación de lógica y presentación
- **Progressive Enhancement** - Funcionalidad base sin JS
- **Mobile First** - Diseño responsive desde móvil

### Próximas Implementaciones

#### Críticas (Prioridad Alta)
1. **Navbar dinámico** con información del usuario
2. **Sistema de saldo real** conectado a database.json
3. **Funcionalidad completa** de depósitos y transferencias
4. **Gestión de sesiones** y seguridad básica

#### Importantes (Prioridad Media)
1. **Historial de transacciones** funcional
2. **Validaciones de seguridad** mejoradas
3. **Manejo de errores** robusto
4. **Experiencia de usuario** pulida

#### Mejoras Futuras (Prioridad Baja)
1. **Configuración de perfil** de usuario
2. **Notificaciones** push y email
3. **Funcionalidades avanzadas** (QR, favoritos)
4. **Dashboard administrativo**

## 🐛 Problemas Conocidos

- **Bootstrap Inconsistente**: Mezcla de versiones 4.6 y 5.3
- **Contraseñas sin encriptar**: Almacenadas en texto plano
- **Saldo estático**: No se actualiza con transacciones
- **Idioma mixto**: Algunas páginas en inglés/español
- **Falta gestión de sesiones**: No persiste login

## 📈 Métricas del Proyecto

```
📊 Estadísticas de Desarrollo
├── Archivos HTML: 6
├── Archivos CSS: 6  
├── Archivos JS: 3
├── Usuarios de prueba: 7
├── Páginas completadas: 3/6 (50%)
├── Funcionalidades core: 2/5 (40%)
└── Tiempo estimado restante: 3-4 semanas
```

## 👨‍💻 Información del Desarrollador

**Proyecto**: Trabajo Práctico Módulo 2  
**Programa**: Desarrollo de Aplicaciones Front-End Trainee  
**Fecha de Inicio**: Enero 2026  
**Estado**: En desarrollo activo  

### Notas del Desarrollador
- ✅ Se actualizó index y login con JS y jQuery
- ✅ Base de datos JSON creada para usuarios de prueba  
- ✅ Modal de bienvenida y estilos propios implementados
- ⏳ Pendiente: Navbar con identificación de usuario
- ⏳ Pendiente: Saldo actual dinámico en menú

## 📞 Contacto y Soporte

Para reportar problemas o sugerencias:
- 📧 **Email**: [correo-del-desarrollador]
- 📁 **Issues**: [link-a-issues-del-repo]
- 📚 **Documentación**: Ver `TODO.txt` para detalles técnicos

## 📜 Licencia

Este proyecto es parte de un trabajo académico para el programa de Desarrollo Front-End Trainee.

---

**Última actualización**: 9 de enero de 2026  
**Versión**: 0.4.0 (Alpha)  
**Estado**: 🚧 En desarrollo activo