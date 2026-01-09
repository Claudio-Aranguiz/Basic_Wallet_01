// auth.js - Sistema de autenticación AlkeWallet

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.database = null;
        this.loadDatabase();
    }

    // Cargar la base de datos JSON
    async loadDatabase() {
        try {
            // Intentar diferentes rutas para la base de datos
            let response;
            const possiblePaths = [
                '../database.json',           // Desde views/
                './database.json',            // Desde raíz
                '/database.json',             // Ruta absoluta
                'database.json'               // Mismo directorio
            ];
            
            for (const path of possiblePaths) {
                try {
                    response = await fetch(path);
                    if (response.ok) {
                        console.log(`Base de datos encontrada en: ${path}`);
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
            
            if (!response || !response.ok) {
                throw new Error('No se pudo encontrar database.json en ninguna ruta');
            }
            
            this.database = await response.json();
            console.log('Base de datos cargada correctamente');
        } catch (error) {
            console.error('Error al cargar la base de datos:', error);
            console.warn('Usando datos de fallback para pruebas');
            
            // Fallback con datos de prueba
            this.database = {
                users: [
                    {
                        id: 1,
                        username: "admin",
                        email: "admin@alkewallet.com",
                        password: "admin123",
                        firstName: "Administrador",
                        lastName: "AlkeWallet",
                        phone: "+56900000001",
                        balance: 1000000,
                        accountNumber: "12345678000",
                        createdAt: "2025-01-01T08:00:00Z",
                        isActive: true,
                        profileImage: "img/admin-avatar.png"
                    },
                    {
                        id: 2,
                        username: "juan.perez",
                        email: "juan.perez@email.com",
                        password: "123456",
                        firstName: "Juan",
                        lastName: "Pérez",
                        phone: "+56912345678",
                        balance: 250000,
                        accountNumber: "12345678901",
                        createdAt: "2025-01-01T10:00:00Z",
                        isActive: true,
                        profileImage: "img/avatar1.png"
                    },
                    {
                        id: 3,
                        username: "maria.gonzalez",
                        email: "maria.gonzalez@email.com",
                        password: "password123",
                        firstName: "María",
                        lastName: "González",
                        phone: "+56987654321",
                        balance: 180000,
                        accountNumber: "12345678902",
                        createdAt: "2025-01-02T14:30:00Z",
                        isActive: true,
                        profileImage: "img/avatar2.png"
                    },
                    {
                        id: 4,
                        username: "test",
                        email: "test@test.com",
                        password: "123",
                        firstName: "Usuario",
                        lastName: "Prueba",
                        phone: "+56900000000",
                        balance: 100000,
                        accountNumber: "12345678999",
                        createdAt: "2025-01-05T12:00:00Z",
                        isActive: true,
                        profileImage: "img/avatar1.png"
                    }
                ]
            };
        }
    }


    // Función de login
    async login(email, password) {
        // Inicia llamando a la DB y espera a que la base de datos esté cargada
        if (!this.database) {
            await this.loadDatabase();
        }

        // Buscar usuario por email únicamente
        const user = this.database.users.find(u => 
            u.email === email && 
            u.password === password &&
            u.isActive
        );

        if (user) {
            // Login exitoso
            this.currentUser = { ...user };
            delete this.currentUser.password; // No almacenar la contraseña en memoria
            
            // Guardar en localStorage
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loginTimestamp', Date.now());
            
            // Verificar seguridad de la contraseña (advertencia, no bloqueo)
            const passwordWarning = this.checkPasswordSecurity(password);
            let message = `¡Bienvenido ${user.firstName} ${user.lastName}!`;
            
            if (passwordWarning) {
                // Mostrar advertencia después del login exitoso
                setTimeout(() => {
                    if (confirm(`${passwordWarning}\n\n¿Te gustaría cambiar tu contraseña más tarde para mayor seguridad?`)) {
                        localStorage.setItem('passwordChangeRequired', 'true');
                    }
                }, 3000);
            }
            
            return {
                success:   true,
                user:      this.currentUser,
                message:   message
            };

        } else {
            // Verificar si existe el email
            const emailExists = this.database.users.find(u => u.email === email);
            
            if (!emailExists) {
                return {
                    success: false,
                    message: 'No existe una cuenta con este email. ¿Deseas registrarte?'
                };
            } else if (!emailExists.isActive) {
                return {
                    success: false,
                    message: 'Tu cuenta está desactivada. Contacta al soporte.'
                };
            } else {
                return {
                    success: false,
                    message: 'Contraseña incorrecta. Verifica e intenta nuevamente.'
                };
            }
        }
    }

    // Verificar seguridad de la contraseña
    checkPasswordSecurity(password) {
        const warnings = [];
        
        if (password.length < 6) {
            warnings.push('tu contraseña es muy corta');
        }
        
        if (!/\d/.test(password)) {
            warnings.push('no contiene números');
        }
        
        if (!/[a-zA-Z]/.test(password)) {
            warnings.push('no contiene letras');
        }
        
        if (!/[A-Z]/.test(password)) {
            warnings.push('no contiene mayúsculas');
        }
        
        if (password === '123' || password === '123456' || password === 'password') {
            warnings.push('es una contraseña muy común');
        }
        
        if (warnings.length > 0) {
            return `⚠️ Advertencia de seguridad: ${warnings.join(', ')}.`;
        }
        
        return null;
    }

    // Verificar si el usuario está logueado
    isAuthenticated() {
        const isLoggedIn      = localStorage.getItem('isLoggedIn');
        const currentUser     = localStorage.getItem('currentUser');
        const loginTimestamp  = localStorage.getItem('loginTimestamp');
        
        if (!isLoggedIn || !currentUser || !loginTimestamp) {
            return false;
        }

        // Verificar si la sesión ha expirado (24 horas)
        const now = Date.now();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
        
        if (now - parseInt(loginTimestamp) > sessionDuration) {
            this.logout();
            return false;
        }

        this.currentUser = JSON.parse(currentUser);
        return true;
    }

    // Obtener usuario actual
    getCurrentUser() {
        if (this.isAuthenticated()) {
            return this.currentUser;
        }
        return null;
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTimestamp');
    }

    // Actualizar saldo del usuario (para transferencias y depósitos)
    async updateUserBalance(userId, newBalance) {
        // En una aplicación real, esto sería una llamada a la API
        // Aquí simulamos la actualización local
        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser.balance = newBalance;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    // Obtener usuarios para transferencias (sin contraseñas)
    getTransferableUsers() {
        if (!this.database || !this.currentUser) return [];
        
        return this.database.users
            .filter(user => user.id !== this.currentUser.id && user.isActive)
            .map(user => ({
                id            : user.id,
                firstName     : user.firstName,
                lastName      : user.lastName,
                username      : user.username,
                accountNumber : user.accountNumber
            }));
    }
}

// Función para redirigir de manera segura
function safeRedirect(url) {
    // Intentar diferentes métodos de redirección
    try {
        window.location.replace(url);
    } catch (e) {
        try {
            window.location.href = url;
        } catch (e2) {
            // Fallback: recargar la página actual y luego redirigir
            window.location.assign(url);
        }
    }
}

// Instancia global del gestor de autenticación
const authManager = new AuthManager();

// Funciones globales para uso en los formularios
window.handleLogin = async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Mostrar indicador de carga
    const loginBtn         = document.querySelector('.login-btn');
    const originalText     = loginBtn.textContent;

    loginBtn.textContent   = 'Iniciando sesión...';
    loginBtn.disabled      = true;
    
    
    try {
        const result = await authManager.login(email, password);
        
        if (result.success) {
            // Intentar mostrar modal de bienvenida
            try {
                const welcomeMessage = document.getElementById('welcomeMessage');
                if (welcomeMessage) {
                    welcomeMessage.textContent = result.message;
                }
                
                const welcomeModalElement = document.getElementById('welcomeModal');
                if (welcomeModalElement && typeof bootstrap !== 'undefined') {
                    const welcomeModal = new bootstrap.Modal(welcomeModalElement);
                    welcomeModal.show();
                    
                    // Redirigir después de mostrar la bienvenida
                    setTimeout(() => {
                        safeRedirect('menu.html');
                    }, 2500);
                } else {
                    // Fallback si el modal no está disponible
                    showMessage(result.message, 'success');
                    setTimeout(() => {
                        safeRedirect('menu.html');
                    }, 1500);
                }
            } catch (modalError) {
                // Fallback en caso de error con el modal
                console.warn('Error con el modal de bienvenida:', modalError);
                showMessage(result.message, 'success');
                setTimeout(() => {
                    safeRedirect('menu.html');
                }, 1500);
            }
        } else {
            showMessage(result.message, 'error');
            // Restaurar botón en caso de error
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error durante el login:', error);
        showMessage('Error de conexión. Inténtalo nuevamente.', 'error');
        // Restaurar botón en caso de error
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    }
};

// Función para mostrar mensajes
function showMessage(message, type) {
    // Remover mensajes anteriores
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.querySelector('.login-form, .register-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Verificar autenticación al cargar páginas protegidas
function checkAuthentication() {
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['login.html', 'index.html', ''];
    
    if (!publicPages.includes(currentPage) && !authManager.isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Ejecutar verificación al cargar la página
document.addEventListener('DOMContentLoaded', checkAuthentication);

// Función de logout global
window.logout = function() {
    authManager.logout();
    window.location.href = 'login.html';
};

// Exponer authManager globalmente
window.authManager = authManager;