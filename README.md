# 💳 AlkeWallet - Billetera Digital Premium

## 📖 Descripción del Proyecto

**AlkeWallet** es una aplicación web de billetera digital de alto rendimiento, diseñada con una estética **premium (Glassmorphism)** y una arquitectura modular sólida. Este proyecto, desarrollado para el Módulo 2 del programa Desarrollo Frontend, permite a los usuarios gestionar sus finanzas digitales con total realismo, incluyendo depósitos, transferencias entre usuarios y un historial dinámico persistente.

## 🚀 Estado del Proyecto (Enero 2026)

**Progreso: 100% (Fase 2: Mantenimiento y Optimización Completada + Nuevas Funcionalidades UX)** ⭐⭐⭐⭐⭐

### ✅ Nuevas Funcionalidades Implementadas (Enero 2026)

- **🔐 Sistema "Recuérdame" Avanzado**: 
  - Funcionalidad completa para mantener datos de login preiniciados
  - Almacenamiento seguro en localStorage con expiración automática (30 días)
  - Solo guarda información no sensible (email), nunca contraseñas
  - Precarga automática de datos con efectos visuales y notificaciones informativas

- **👁️ Toggle de Contraseña Interactivo**:
  - Botón de mostrar/ocultar contraseña con icono dinámico (Font Awesome)
  - Implementación jQuery con experiencia táctil optimizada para móvil
  - Auto-ocultar por seguridad cuando pierde el foco
  - Diseño responsivo con estilos coherentes al tema AlkeWallet

- **♿ Mejoras de Accesibilidad y Compatibilidad**:
  - Soporte completo Safari 3+ con prefijos CSS `-webkit-`
  - Atributos `title` y `aria-labels` para lectores de pantalla
  - Orden correcto de prefijos CSS según estándares web
  - Experiencia táctil mejorada en dispositivos móviles

### ✅ Arquitectura y Mejoras Previas

- **🎨 Arquitectura CSS Modular**: 
  - Estilos organizados en capas: `styles.css` (Base), `mobile.css` (Mobile-First), `tablet-desktop.css` (Responsive) y `modals-alerts.css` (Componentes específicos).
  - Uso extensivo de **Variables CSS** para una gestión de temas coherente.
  - Diseño **Glassmorphism** implementado con efectos de desenfoque y transparencias premium.

- **🛡️ Núcleo JavaScript Optimizado**:
  - **SessionManager.js**: Centraliza la sesión, el control de acceso y utilidades globales como el formato de moneda estándar (COP).
  - **Ready-Promise Pattern**: Garantiza que todos los módulos (`DepositManager`, `ContactManager`, etc.) se inicialicen solo cuando los datos del usuario estén listos.
  - ** DRY (Don't Repeat Yourself)**: Eliminación de redundancias y consolidación de utilidades comunes.

- **🎯 Sistema de Validación Universal**:
  - Implementación de `validation.js` con soporte para validación en tiempo real basada en atributos `data-validate`.
  - Feedback visual inmediato (Valid/Invalid) en todos los formularios de la app.

- **🔔 Notificaciones Personalizadas**:
  - Reemplazo total de `alert()` y `confirm()` nativos por un sistema de notificaciones propio de AlkeWallet, con barras de progreso y animaciones fluidas.

- **♿ Accesibilidad Proactiva**:
  - Cumplimiento de estándares de accesibilidad mediante el uso de `aria-labels` y `titles` en elementos interactivos e iconos, garantizando una experiencia inclusiva.

---

## 🛠️ Tecnologías y Herramientas

### Frontend Core
- **HTML5 Semantic** & **CSS3 Modern** (Variables, Flexbox, Grid).
- **JavaScript ES6+** (Modules, Classes, Promises).
- **jQuery 3.7.1** (Manejo eficiente del DOM).
- **Bootstrap 4.6.2** (Estructura base consistente).

### Datos y Persistencia
- **JSON Database**: Simulación de backend robusta mediante `database.js`.
- **LocalStorage API**: Persistencia completa de sesiones, contactos y transacciones.

---

## 📁 Estructura del Proyecto

```
AlkeWallet/
├── 📁 css/                          # Capas de Estilo Modular
│   ├── 📄 styles.css                # Variables y Base
│   ├── 📄 mobile.css                # Layout Mobile-First
│   ├── 📄 tablet-desktop.css        # Media Queries Optimizadas
│   └── 📄 modals-alerts.css         # Componentes de UI
├── 📁 js/                           # Lógica de Negocio Modular
│   ├── 📄 sessionManager.js         # Core y Utilidades
│   ├── 📄 transactionManager.js     # Motor de Transacciones
│   ├── 📄 depositManager.js         # Lógica de Depósitos
│   ├── 📄 sendMoney.js              # Lógica de Transferencias
│   ├── 📄 validation.js             # Sistema Universal de Validación
│   └── [otros managers]
├── 📁 views/                        # Vistas de la Aplicación
│   ├── 📄 menu.html                 # Dashboard Principal
│   ├── 📄 deposit.html              # Interfaz de Carga
│   └── [otras vistas]
└── 📁 data/                         # Capa de Datos
    └── 📄 database.js               # Mock Database ES6
```

---

## 🎯 Funcionalidades Destacadas

### 💰 Bono de Bienvenida y Configuración
- Los nuevos usuarios reciben automáticamente un **Bono de Activación de $50,000 COP**.
- Modal de configuración de cuenta para personalizar Alias y Banco asociado.

### 💸 Transferencias Reales
- Sistema de búsqueda de contactos integrado.
- Validación de saldo en tiempo real antes de procesar transferencias.
- Registro instantáneo en el historial con persistencia entre sesiones.

### 🔒 Seguridad y Acceso
- Control de acceso de páginas basado en el estado de la sesión.
- Protección de rutas privadas.
- Limpieza automática de datos sensibles al cerrar sesión.
- **NUEVO**: Sistema "Recuérdame" con almacenamiento seguro y expiración automática.

### 🎨 Experiencia de Usuario (UX/UI)
- **NUEVO**: Toggle visual de contraseña con iconos dinámicos.
- **NUEVO**: Notificaciones informativas para funciones de recordar datos.
- **NUEVO**: Efectos visuales para campos preiniciados.
- **NUEVO**: Compatibilidad cross-browser optimizada (Safari, Chrome, Firefox, Edge).

---

## 🚀 Instalación y Prueba

1. **Clonar**: `git@github.com:Claudio-Aranguiz/Basic_Wallet_01.git`
2. **Ejecutar**: Abrir `views/index.html` con **Live Server**.

### Usuarios de Prueba
| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@alkewallet.com` | `admin123` | Admin |
| `juan.perez@email.com` | `123456` | Usuario Pro |
| `test@test.com` | `123` | Testing |

---

## 👨‍💻 Información Técnica
**Desarrollado por**: Claudio Aránguiz  
**Versión Actual**: 2.1.0 (Enhanced UX + Login Improvements)  
**Última Actualización**: Enero 2026 - Funcionalidades "Recuérdame" y Toggle de Contraseña  
**Licencia**: Académica (Educacional)

---
© 2026 AlkeWallet. Todos los derechos reservados.