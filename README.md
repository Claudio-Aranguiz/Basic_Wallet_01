# 💳 AlkeWallet - Billetera Digital

## 📖 Descripción del Proyecto

**AlkeWallet** es una aplicación web de billetera digital completa desarrollada como parte del trabajo práctico del Módulo 2 - Fundamentos del desarrollo Frontend. La aplicación permite a los usuarios gestionar su dinero digital de forma segura y sencilla, con funcionalidades reales de depósito, transferencia e historial de transacciones.

## 🚀 Estado Actual del Proyecto

**Progreso: 100% (Fase 1: Refactorización Estética y Funcional)** ⭐⭐⭐⭐⭐

### ✅ Funcionalidades Completadas

- **🔐 Sistema de Autenticación Completo**
  - Inicio de sesión con email y contraseña reales
  - Gestión de sesiones con persistencia
  - Validaciones robustas con feedback visual
  - Redirección automática y protección de rutas
  - SessionManager.js para gestión integral

- **💰 Sistema de Saldos Dinámicos**
  - Saldos reales conectados con base de datos
  - Actualización en tiempo real en todas las páginas
  - Cálculo basado en historial de transacciones
  - TransactionManager.js con persistencia localStorage
  - Homologación completa entre páginas

- **💸 Sistema de Transferencias Real**
  - Transferencias reales entre usuarios registrados
  - Validación de saldos suficientes
  - ContactManager.js para gestión de contactos
  - SendMoney.js con procesamiento completo
  - Actualización automática de saldos

- **💳 Sistema de Depósitos**
  - Modal de confirmación elegante
  - 5 métodos de pago (banco, tarjeta, PayPal, crypto, efectivo)
  - Validaciones de montos ($1,000 - $5,000,000)
  - DepositManager.js integrado
  - Registro automático en historial

- **📊 Historial de Transacciones**
  - Visualización completa de transacciones
  - Filtrado automático por tipo y fecha
  - Persistencia en localStorage
  - Transactions.js para interfaz dinámica
  - Formato profesional con badges

- **🎨 Interfaz Premium (Glassmorphism)**
  - Diseño "Cristal" con desenfoque de fondo y transparencias
  - Layout centralizado con `.app-container` para monitores grandes
  - Fondo temático Fintech generado por IA
  - Alineación responsiva mejorada en todas las vistas
  - Navbar consistente y botones homologados

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica y accesible
- **CSS3** - Estilos responsive y animaciones avanzadas
- **JavaScript (ES6+)** - Clases, módulos y programación asíncrona
- **jQuery 3.7.1** - Manipulación DOM y eventos
- **Bootstrap 4.6.2** - Framework CSS consistente

### Gestión de Datos
- **Database.js** - Base de datos en JavaScript (solución CORS)
- **LocalStorage** - Persistencia de transacciones y sesiones
- **JSON** - Estructura de datos y configuración

### Herramientas de Desarrollo
- **Font Awesome 6.0** - Iconografía profesional
- **Google Fonts** - Tipografía Montserrat
- **VS Code** - IDE con extensiones de desarrollo
- **Microsoft Edge Tools** - Testing y accesibilidad

## 📁 Estructura del Proyecto

```
AlkeWallet/
├── 📄 index.html                    # Página de entrada (redirige a views/)
├── 📄 database.json                 # Base de datos JSON principal
├── 📄 README.md                     # Documentación completa
├── 📄 TODO.txt                      # Seguimiento de desarrollo
├── 📄 notasDelDesarrollador.txt     # Notas técnicas
├── 📁 views/                        # Páginas de la aplicación
│   ├── 📄 index.html                # Landing page
│   ├── 📄 login.html                # Sistema de autenticación
│   ├── 📄 menu.html                 # Dashboard principal
│   ├── 📄 deposit.html              # Sistema de depósitos ✅
│   ├── 📄 sendmoney.html            # Sistema de transferencias ✅
│   └── 📄 transactions.html         # Historial completo ✅
├── 📁 css/                          # Estilos organizados
│   ├── 📄 styles.css                # Hoja principal con mejoras
│   ├── 📄 mobile.css                # Responsive móvil
│   ├── 📄 tablet.css                # Responsive tablet  
│   ├── 📄 desktop.css               # Responsive escritorio
│   ├── 📄 notebooks.css             # Pantallas grandes
│   └── 📄 modals-alerts.css         # Modales y alertas
├── 📁 js/                           # Scripts modulares
│   ├── 📄 sessionManager.js         # Gestión completa de sesiones ✅
│   ├── 📄 transactionManager.js     # Historial y persistencia ✅
│   ├── 📄 depositManager.js         # Sistema de depósitos ✅
│   ├── 📄 sendMoney.js              # Transferencias reales ✅
│   ├── 📄 contactManager.js         # Gestión de contactos ✅
│   ├── 📄 menuManager.js            # Saldos homologados ✅
│   ├── 📄 transactions.js           # Interfaz de historial ✅
│   ├── 📄 auth.js                   # Sistema de autenticación ✅
│   ├── 📄 notifications.js          # Sistema de notificaciones
│   ├── 📄 register.js               # Registro de usuarios
│   └── 📄 validation.js             # Validaciones de formularios
├── 📁 data/                         # Datos de la aplicación
│   └── 📄 database.js               # Base de datos JavaScript ✅
└── 📁 img/                          # Recursos gráficos
    └── [assets del proyecto]
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Opcional: Live Server o servidor local

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/[usuario]/AlkeWallet
cd AlkeWallet
```

2. **Ejecutar la aplicación**
   - Abrir `views/login.html` en el navegador, O
   - Usar Live Server en VS Code (recomendado)
   - Configurar servidor local (Apache, nginx, etc.)

### Usuarios de Prueba

| Email | Contraseña | Descripción |
|-------|------------|-------------|
| `juan.perez@email.com` | `j12345` | Usuario con transacciones |
| `admin@alkewallet.com` | `a12345` | Administrador del sistema |
| `maria.gonzalez@email.com` | `m12345` | Usuario regular |
| `carlos.rodriguez@email.com` | `c12345` | Usuario para pruebas |
| `ana.martinez@email.com` | `123456` | Usuario con saldo alto |
| `luis.garcia@email.com` | `123456` | Usuario estándar |
| `sofia.lopez@email.com` | `123456` | Usuario de ejemplo |

## 🎯 Funcionalidades Implementadas

### 🔐 Autenticación y Sesiones
- [x] Inicio de sesión con validación real
- [x] Gestión de sesiones persistentes
- [x] Protección de rutas y redirección automática
- [x] SessionManager con saveUserSession()
- [x] Verificación de autenticación en cada página

### 💰 Gestión de Saldo
- [x] Saldos dinámicos conectados con TransactionManager
- [x] Actualización en tiempo real en todas las páginas
- [x] Cálculo basado en historial de transacciones
- [x] Persistencia en localStorage
- [x] Homologación completa entre páginas

### 💸 Transacciones
- [x] **Depósitos** con 5 métodos de pago y modal de confirmación
- [x] **Transferencias** reales entre usuarios registrados
- [x] **Validación** de saldos suficientes y montos válidos
- [x] **Confirmaciones** elegantes con feedback visual
- [x] **Registro automático** en historial de transacciones

### 📊 Historial y Reportes
- [x] Lista completa de transacciones del usuario
- [x] Ordenamiento por fecha (más recientes primero)
- [x] Formato profesional con badges por tipo
- [x] Persistencia garantizada entre sesiones
- [x] Interfaz dinámica con carga automática

### 🎨 Experiencia de Usuario
- [x] Navbar homologado en todas las páginas
- [x] Diseño responsive para todos los dispositivos
- [x] Efectos hover y animaciones suaves
- [x] Notificaciones y feedback visual
- [x] Accesibilidad web (WCAG compliance)

## 🔧 Arquitectura Técnica

### Módulos JavaScript
- **SessionManager** - Autenticación y gestión de sesiones
- **TransactionManager** - Historial y persistencia de transacciones
- **DepositManager** - Sistema completo de depósitos
- **SendMoneyManager** - Transferencias entre usuarios
- **ContactManager** - Gestión de contactos y usuarios
- **MenuManager** - Dashboard y saldos homologados
- **Database.js** - Solución CORS para acceso a datos

### Patrones de Diseño
- **Singleton** - Managers globales únicos
- **Observer** - Actualización de saldos en tiempo real
- **Module** - Encapsulación y organización del código
- **MVC** - Separación de lógica, datos y presentación

### Soluciones Técnicas Implementadas
- **CORS Solution** - Database.js para evitar restricciones file://
- **Persistencia** - localStorage para transacciones y sesiones
- **Validaciones** - Sistema robusto con feedback visual
- **Accesibilidad** - aria-labels, títulos y placeholders
- **Performance** - CSS externo y optimización de recursos

## 📈 Características Avanzadas

### 🔒 Seguridad
- Validación de sesiones en cada página
- Protección contra inyección básica
- Verificación de saldos antes de transacciones
- Encriptación básica de datos sensibles

### 🎨 UI/UX
- Diseño moderno con Material Design influences
- Animaciones suaves y micro-interacciones
- Feedback visual inmediato para todas las acciones
- Responsive design con Mobile First approach

### ⚡ Performance
- Carga rápida con CSS optimizado
- JavaScript modular y eficiente
- localStorage para persistencia local
- Minimización de reflows y repaints

## 🐛 Mejoras Implementadas

### Problemas Resueltos
- ✅ **Bootstrap Unificado** - Versión 4.6.2 en todo el proyecto
- ✅ **Saldos Sincronizados** - TransactionManager con cálculo dinámico
- ✅ **Sesiones Persistentes** - SessionManager con localStorage
- ✅ **CORS Issues** - Database.js como solución elegante
- ✅ **Accesibilidad** - Estándares WCAG implementados

### Optimizaciones Técnicas
- CSS externo sin estilos inline
- JavaScript modular con clases ES6+
- Manejo de errores robusto
- Logging completo para debugging
- Validaciones en tiempo real

## 📊 Métricas del Proyecto

```
📊 Estadísticas Finales (Fase 1)
├── Archivos HTML: 6 páginas (Refactored)
├── Archivos CSS: 1 hoja consolidada (Pendiente Modularización)
├── Archivos JS: 11 módulos funcionales
├── Usuarios de prueba: 7 con datos reales
├── Funcionalidades core: 100% ✅
├── Estética Premium: 100% ✅  
├── Integraciones: 100% funcionales ✅
└── Estado: Fase 1 Completada ✅
```

## 🎉 Logros del Desarrollo

### Pasos Completados
1. **PASO 1** ✅ - Sistema de autenticación real
2. **PASO 2** ✅ - Sistema de transferencias funcional  
3. **PASO 3** ✅ - Sistema de depósitos con modal
4. **PASO 4** ✅ - Historial de transacciones persistente
5. **HOMOLOGACIÓN** ✅ - Saldos y estilos unificados

### Integraciones Exitosas
- SessionManager ↔ TransactionManager
- DepositManager ↔ TransactionManager  
- SendMoneyManager ↔ ContactManager
- MenuManager ↔ Todos los sistemas
- Database.js ↔ Todos los managers

## 👨‍💻 Información del Desarrollador

**Proyecto**: Trabajo Práctico Módulo 2  
**Programa**: Desarrollo de Aplicaciones Front-End Trainee  
**Fecha de Inicio**: 9 de enero de 2026  
**Fecha de Finalización**: 11 de enero de 2026  
**Duración**: 3 días de desarrollo intensivo  

### Hitos del Desarrollo
- **Día 1**: Autenticación y estructura base
- **Día 2**: Transferencias y persistencia  
- **Día 3**: Depósitos, historial y homologación completa

## 🚀 Funcionalidades de Producción

AlkeWallet está **listo para uso real** con:
- ✅ Autenticación funcional
- ✅ Transferencias entre usuarios
- ✅ Depósitos con múltiples métodos
- ✅ Historial completo y persistente
- ✅ Interfaz profesional y responsive
- ✅ Saldos dinámicos en tiempo real

## 📞 Información de Contacto

**Estado**: ✅ Proyecto completado exitosamente  
**Documentación**: Ver `TODO.txt` para detalles técnicos  
**Notas**: Ver `notasDelDesarrollador.txt` para insights

## 📜 Licencia

Este proyecto es parte de un trabajo académico para el programa de Desarrollo Front-End Trainee. Desarrollado con fines educativos y demostrativos.

---

**Última actualización**: 11 de enero de 2026  
**Versión**: 1.1.0 (Refactor UI) 🎉  
**Estado**: ✅ **Fase 1: Estética y Homologación completada**
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

#### Estructurales y Performance (Próxima Fase)
1. **Restructuración de `styles.css`**: Modularizar el código en segmentos de Layout, Componentes y Media Queries para mejor mantenimiento.
2. **Sistema de Notificaciones Personalizado**: Reemplazar alertas restantes por un sistema propio de AlkeWallet.
3. **Optimización de Assets**: Revisar pesos de imágenes y rutas.

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
- 📧 **Email**: caranguizh@outlook.com
- 📁 **Issues**: [link-a-issues-del-repo]
- 📚 **Documentación**: Ver `TODO.txt` para detalles técnicos

## 📜 Licencia

Este proyecto es parte de un trabajo académico para el programa de Desarrollo Front-End Trainee.

---

**Última actualización**: 11 de enero de 2026  
**Versión**: 0.4.0 (Alpha)  
**Estado**: 🚧 En desarrollo activo