# 🔒 Funcionalidad "Recuérdame" - AlkeWallet

## 📋 Descripción

La funcionalidad "Recuérdame" permite a los usuarios mantener sus datos de acceso preiniciados en el formulario de login, mejorando la experiencia de usuario y facilitando el acceso recurrente a la aplicación.

## ✨ Características Implementadas

### 🎯 Funcionalidades Principales

1. **Guardado Automático de Email**: Cuando el checkbox está marcado, el email del usuario se guarda en localStorage.

2. **Precarga Automática**: Al abrir la página de login, si existen datos guardados, el email se precarga automáticamente.

3. **Gestión de Datos**: 
   - Los datos se mantienen por 30 días
   - Se limpian automáticamente si el checkbox se desmarca
   - Se eliminan cuando expiran

4. **Experiencia Visual**:
   - Campo de email con efecto visual cuando se precarga
   - Notificaciones informativas sobre el estado de los datos
   - Checkbox personalizado con estilos coherentes

### 🔧 Funciones Implementadas

#### `saveRememberMeData(email, remember, showNotifications = true)`
- Guarda o elimina los datos de "Recuérdame" según el estado del checkbox
- Incluye timestamp para manejo de expiración
- Opción para mostrar/ocultar notificaciones

#### `loadRememberMeData()`
- Carga datos guardados al inicializar la página
- Verifica expiración (30 días)
- Precarga campos y marca checkbox automáticamente
- Muestra notificación de bienvenida

#### `clearRememberMeData()`
- Limpia datos guardados del localStorage
- Utilizada en logout y cuando se desmarca checkbox

## 🎨 Estilos CSS Agregados

```css
/* Checkbox personalizado */
.form-check-input:checked {
    background-color: var(--highlight-color) !important;
    border-color: var(--highlight-color) !important;
}

/* Efecto visual para campos pre-llenados */
.form-control.pre-filled {
    background-color: rgba(27, 249, 241, 0.05);
    border-color: var(--highlight-color);
    animation: subtle-glow 0.5s ease-in-out;
}
```

## 🚀 Uso

### Para el Usuario

1. **Marcar Checkbox**: Al hacer login, marca el checkbox "Recuérdame"
2. **Login Automático**: En próximas visitas, el email aparecerá precargado
3. **Desmarcar**: Si desmarca el checkbox, los datos se borran inmediatamente

### Para el Desarrollador

```javascript
// Los datos se guardan en localStorage con esta estructura:
{
    "email": "usuario@email.com",
    "timestamp": 1673525842000
}

// Eventos principales:
- DOMContentLoaded: Carga datos guardados
- Checkbox change: Guarda/limpia datos según estado
- Email blur: Actualiza email guardado si checkbox está marcado
- Login success: Guarda datos si checkbox está marcado
- Logout: Mantiene datos si checkbox estaba marcado
```

## 📱 Características de Seguridad

1. **Expiración Automática**: Los datos expiran después de 30 días
2. **Solo Email**: Solo se guarda el email, nunca la contraseña
3. **Limpieza en Logout**: Opción de mantener o limpiar datos al cerrar sesión
4. **Validación de Datos**: Verificación de integridad al cargar datos

## 🔔 Notificaciones

- **Datos Guardados**: Confirma cuando se activa "Recuérdame"
- **Datos Eliminados**: Informa cuando se desactiva la funcionalidad
- **Bienvenida**: Saludo cuando se cargan datos automáticamente
- **Datos Expirados**: Limpieza silenciosa de datos vencidos

## 📊 Almacenamiento

Los datos se almacenan en localStorage del navegador con la clave:
- `alkewallet_remember`: Contiene email y timestamp

## 🔄 Ciclo de Vida

1. Usuario marca checkbox → Se guarda email
2. Usuario cierra navegador → Datos persisten
3. Usuario regresa → Datos se cargan automáticamente
4. Después de 30 días → Datos expiran y se limpian
5. Usuario desmarca checkbox → Datos se eliminan inmediatamente

---

> 📝 **Nota**: Esta funcionalidad mejora la experiencia de usuario manteniendo estándares de seguridad, ya que solo almacena información no sensible (email) y nunca la contraseña.