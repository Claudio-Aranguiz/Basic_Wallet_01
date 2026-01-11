/**
 * Session Manager - AlkeWallet
 * Gestiona sesiones de usuario y sincronización de datos
 */

class SessionManager {
    constructor() {
        this.database = null;
        this.currentUser = null;
        this.isAuthenticated = false;
        this.initializeSession();
    }

    // Inicializar sesión al cargar la página
    async initializeSession() {
        try {
            await this.loadDatabase();
            await this.loadUserSession();
            this.updateUserDisplay();
            this.checkPageAccess();
            console.log('✅ SessionManager inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando SessionManager:', error);
        }
    }

    // Cargar base de datos
    async loadDatabase() {
        try {
            // Usar la variable global DATABASE cargada desde database.js
            if (window.DATABASE) {
                this.database = window.DATABASE;
                console.log('✅ Database cargada desde database.js:', this.database.users.length, 'usuarios');
                // Guardar en localStorage como cache
                localStorage.setItem('alkewallet_database', JSON.stringify(this.database));
            } else {
                throw new Error('window.DATABASE no está disponible');
            }
        } catch (error) {
            console.error('❌ Error cargando database:', error);
            // Fallback a localStorage si existe data previa
            const cachedDB = localStorage.getItem('alkewallet_database');
            if (cachedDB) {
                this.database = JSON.parse(cachedDB);
                console.log('⚠️ Usando cache de database desde localStorage');
            } else {
                console.error('❌ No se pudo cargar ninguna base de datos');
            }
        }
    }

    // Cargar sesión de usuario desde localStorage
    async loadUserSession() {
        try {
            const sessionData = localStorage.getItem('alkewallet_session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                
                // Verificar que la sesión no haya expirado
                const now = new Date().getTime();
                if (session.expires > now) {
                    // Buscar usuario actual en database
                    const user = this.database?.users?.find(u => u.id === session.userId);
                    if (user && user.isActive) {
                        this.currentUser = user;
                        this.isAuthenticated = true;
                        console.log('✅ Sesión válida:', user.firstName);
                        return;
                    }
                }
                
                // Sesión inválida
                this.clearSession();
            }
        } catch (error) {
            console.error('❌ Error cargando sesión:', error);
            this.clearSession();
        }
    }

    // Guardar sesión del usuario
    saveUserSession() {
        try {
            if (this.currentUser) {
                const session = {
                    userId: this.currentUser.id,
                    expires: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 horas
                };
                
                localStorage.setItem('alkewallet_session', JSON.stringify(session));
                localStorage.setItem('alkewallet_user', JSON.stringify(this.currentUser));
                console.log('💾 Sesión guardada para:', this.currentUser.firstName);
            }
        } catch (error) {
            console.error('❌ Error guardando sesión:', error);
        }
    }

    // Iniciar sesión
    login(email, password) {
        console.log('🔐 Intentando login:', email);
        
        if (!this.database?.users) {
            console.error('❌ Database no disponible');
            return { success: false, message: 'Error del sistema. Base de datos no disponible.' };
        }

        // Limpiar espacios en blanco
        email = email.trim();
        password = password.trim();

        // Buscar usuario
        const user = this.database.users.find(u => 
            (u.email === email || u.username === email) && u.password === password
        );

        console.log('👤 Usuario encontrado:', user ? `${user.firstName} ${user.lastName}` : 'No');

        if (!user) {
            return { success: false, message: 'Email o contraseña incorrectos. Verifica los datos e intenta nuevamente.' };
        }

        if (!user.isActive) {
            return { success: false, message: 'Cuenta desactivada. Contacte soporte.' };
        }

        // Crear sesión
        this.currentUser = user;
        this.isAuthenticated = true;

        // Guardar en localStorage
        const sessionData = {
            userId: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            loginTime: new Date().getTime(),
            expires: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 horas
        };

        localStorage.setItem('alkewallet_session', JSON.stringify(sessionData));
        localStorage.setItem('alkewallet_database', JSON.stringify(this.database));

        console.log('✅ Login exitoso:', user.firstName);
        return { success: true, user: user };
    }

    // Cerrar sesión
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.clearSession();
        console.log('✅ Sesión cerrada');
    }

    // Limpiar datos de sesión
    clearSession() {
        localStorage.removeItem('alkewallet_session');
        this.currentUser = null;
        this.isAuthenticated = false;
    }

    // Actualizar display de usuario en navbar
    updateUserDisplay() {
        if (!this.isAuthenticated || !this.currentUser) return;

        // Actualizar nombre en navbar
        const userNameElements = document.querySelectorAll('.user-name, .navbar-brand span');
        userNameElements.forEach(el => {
            if (el) el.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        });

        // Actualizar saldo si hay elemento
        this.updateBalanceDisplay();

        // Actualizar avatar inicial
        const avatarIcons = document.querySelectorAll('.user-avatar i');
        avatarIcons.forEach(icon => {
            if (icon) icon.textContent = this.currentUser.firstName.charAt(0).toUpperCase();
        });
    }

    // Actualizar display de saldo
    updateBalanceDisplay() {
        if (!this.currentUser) return;

        const balanceElements = document.querySelectorAll('#currentBalance, .current-balance h2, #inpsaldo');
        balanceElements.forEach(el => {
            if (el) {
                if (el.tagName === 'INPUT') {
                    el.value = this.formatCurrency(this.currentUser.balance);
                } else {
                    el.textContent = this.formatCurrency(this.currentUser.balance);
                }
            }
        });
    }

    // Formatear moneda
    formatCurrency(amount) {
        return `$${parseInt(amount).toLocaleString('es-CL')}`;
    }

    // Verificar acceso a página
    checkPageAccess() {
        const currentPath = window.location.pathname;
        const publicPages = ['/index.html', '/login.html', '/', '/views/index.html', '/views/login.html'];
        const isPublicPage = publicPages.some(page => currentPath.endsWith(page) || currentPath === '/');

        if (!isPublicPage && !this.isAuthenticated) {
            console.log('❌ Acceso denegado. Redirigiendo a login...');
            window.location.href = './login.html';
        }
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Obtener saldo actual
    getCurrentBalance() {
        return this.currentUser?.balance || 0;
    }

    // Actualizar saldo del usuario
    updateUserBalance(newBalance) {
        if (!this.currentUser) return false;

        this.currentUser.balance = newBalance;
        
        // Actualizar en database local
        if (this.database?.users) {
            const userIndex = this.database.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.database.users[userIndex].balance = newBalance;
                localStorage.setItem('alkewallet_database', JSON.stringify(this.database));
            }
        }

        // Actualizar display
        this.updateBalanceDisplay();
        return true;
    }

    // Obtener lista de usuarios (para transferencias)
    getUsers() {
        return this.database?.users?.filter(u => u.isActive && u.id !== this.currentUser?.id) || [];
    }

    // Buscar usuario por email/username
    findUser(identifier) {
        return this.database?.users?.find(u => 
            (u.email === identifier || u.username === identifier) && u.isActive
        );
    }
}

// Instancia global
window.sessionManager = new SessionManager();

// Auto-inicialización cuando DOM está listo
document.addEventListener('DOMContentLoaded', async () => {
    if (window.sessionManager) {
        console.log('🚀 Inicializando SessionManager...');
        try {
            await window.sessionManager.initializeSession();
            console.log('✅ SessionManager listo');
        } catch (error) {
            console.error('❌ Error inicializando SessionManager:', error);
        }
    }
});